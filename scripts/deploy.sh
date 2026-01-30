#!/bin/bash

# Docker Deployment Script for Credo Application
# Supports both AWS ECS and Azure App Service deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="credo-app"
VERSION=${1:-latest}
DEPLOY_TARGET=${2:-aws} # aws or azure

echo -e "${BLUE}🚀 Starting deployment of ${APP_NAME}:${VERSION} to ${DEPLOY_TARGET}${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check AWS CLI if deploying to AWS
    if [ "$DEPLOY_TARGET" = "aws" ]; then
        if ! command -v aws &> /dev/null; then
            print_error "AWS CLI is not installed or not in PATH"
            exit 1
        fi
        
        # Check AWS credentials
        if ! aws sts get-caller-identity &> /dev/null; then
            print_error "AWS credentials not configured"
            exit 1
        fi
    fi
    
    # Check Azure CLI if deploying to Azure
    if [ "$DEPLOY_TARGET" = "azure" ]; then
        if ! command -v az &> /dev/null; then
            print_error "Azure CLI is not installed or not in PATH"
            exit 1
        fi
        
        # Check Azure login
        if ! az account show &> /dev/null; then
            print_error "Not logged in to Azure. Run 'az login' first."
            exit 1
        fi
    fi
    
    print_status "Prerequisites check passed ✓"
}

# Function to build Docker image
build_image() {
    print_status "Building Docker image..."
    
    # Build the image
    docker build -t ${APP_NAME}:${VERSION} .
    docker tag ${APP_NAME}:${VERSION} ${APP_NAME}:latest
    
    print_status "Docker image built successfully ✓"
}

# Function to deploy to AWS ECS
deploy_to_aws() {
    print_status "Deploying to AWS ECS..."
    
    # Get AWS account ID and region
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=${AWS_REGION:-us-east-1}
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    ECR_REPOSITORY="${APP_NAME}"
    
    print_status "Using ECR registry: ${ECR_REGISTRY}"
    
    # Login to ECR
    print_status "Logging into Amazon ECR..."
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
    
    # Tag image for ECR
    docker tag ${APP_NAME}:${VERSION} ${ECR_REGISTRY}/${ECR_REPOSITORY}:${VERSION}
    docker tag ${APP_NAME}:latest ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
    
    # Push to ECR
    print_status "Pushing image to ECR..."
    docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:${VERSION}
    docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
    
    # Update task definition
    print_status "Updating ECS task definition..."
    sed "s|ACCOUNT_ID|${AWS_ACCOUNT_ID}|g; s|REGION|${AWS_REGION}|g" aws/ecs-task-definition.json > /tmp/task-definition.json
    
    TASK_DEF_ARN=$(aws ecs register-task-definition --cli-input-json file:///tmp/task-definition.json --query taskDefinition.taskDefinitionArn --output text)
    
    # Update service
    print_status "Updating ECS service..."
    aws ecs update-service \
        --cluster ${APP_NAME}-cluster \
        --service ${APP_NAME}-service \
        --task-definition ${TASK_DEF_ARN}
    
    # Wait for service stability
    print_status "Waiting for service to stabilize..."
    aws ecs wait services-stable \
        --cluster ${APP_NAME}-cluster \
        --services ${APP_NAME}-service
    
    print_status "AWS ECS deployment completed successfully ✓"
}

# Function to deploy to Azure App Service
deploy_to_azure() {
    print_status "Deploying to Azure App Service..."
    
    # Get Azure subscription info
    AZURE_SUBSCRIPTION=$(az account show --query name --output tsv)
    AZURE_RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-credo-rg}
    ACR_REGISTRY=${ACR_REGISTRY:-credoRegistry}
    
    print_status "Using Azure subscription: ${AZURE_SUBSCRIPTION}"
    print_status "Using resource group: ${AZURE_RESOURCE_GROUP}"
    
    # Login to ACR
    print_status "Logging into Azure Container Registry..."
    az acr login --name ${ACR_REGISTRY}
    
    # Tag image for ACR
    ACR_IMAGE_NAME="${ACR_REGISTRY}.azurecr.io/${APP_NAME}"
    docker tag ${APP_NAME}:${VERSION} ${ACR_IMAGE_NAME}:${VERSION}
    docker tag ${APP_NAME}:latest ${ACR_IMAGE_NAME}:latest
    
    # Push to ACR
    print_status "Pushing image to ACR..."
    docker push ${ACR_IMAGE_NAME}:${VERSION}
    docker push ${ACR_IMAGE_NAME}:latest
    
    # Update App Service
    print_status "Updating Azure App Service..."
    az webapp config container set \
        --resource-group ${AZURE_RESOURCE_GROUP} \
        --name ${APP_NAME} \
        --docker-custom-image-name ${ACR_IMAGE_NAME}:${VERSION} \
        --docker-registry-server-url https://${ACR_REGISTRY}.azurecr.io
    
    # Restart the app service
    print_status "Restarting App Service..."
    az webapp restart --resource-group ${AZURE_RESOURCE_GROUP} --name ${APP_NAME}
    
    # Wait for deployment
    print_status "Waiting for deployment to complete..."
    sleep 30
    
    print_status "Azure App Service deployment completed successfully ✓"
}

# Function to run health check
health_check() {
    print_status "Running health check..."
    
    if [ "$DEPLOY_TARGET" = "aws" ]; then
        # Get load balancer URL
        ALB_DNS=$(aws elbv2 describe-load-balancers \
            --names ${APP_NAME}-lb \
            --query 'LoadBalancers[0].DNSName' \
            --output text 2>/dev/null || echo "")
        
        if [ -n "$ALB_DNS" ]; then
            HEALTH_URL="http://${ALB_DNS}/api/health"
        else
            print_warning "Could not find load balancer URL"
            return
        fi
    else
        # Get App Service URL
        APP_URL=$(az webapp show \
            --resource-group ${AZURE_RESOURCE_GROUP:-credo-rg} \
            --name ${APP_NAME} \
            --query defaultHostName \
            --output text)
        
        HEALTH_URL="https://${APP_URL}/api/health"
    fi
    
    print_status "Checking health at: ${HEALTH_URL}"
    
    # Wait and check
    for i in {1..10}; do
        if curl -f -s "${HEALTH_URL}" > /dev/null; then
            print_status "Health check passed ✓"
            return 0
        fi
        
        print_warning "Health check attempt ${i}/10 failed, retrying in 10 seconds..."
        sleep 10
    done
    
    print_error "Health check failed after 10 attempts"
    return 1
}

# Function to cleanup temporary files
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f /tmp/task-definition.json
}

# Main deployment flow
main() {
    # Set up cleanup trap
    trap cleanup EXIT
    
    # Check prerequisites
    check_prerequisites
    
    # Build image
    build_image
    
    # Deploy based on target
    case $DEPLOY_TARGET in
        "aws")
            deploy_to_aws
            ;;
        "azure")
            deploy_to_azure
            ;;
        *)
            print_error "Invalid deployment target. Use 'aws' or 'azure'"
            exit 1
            ;;
    esac
    
    # Run health check
    health_check
    
    print_status "Deployment completed successfully! 🎉"
    
    # Show next steps
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo -e "1. Monitor your deployment in the ${DEPLOY_TARGET} console"
    echo -e "2. Check application logs for any issues"
    echo -e "3. Test the application functionality"
    echo -e "4. Set up monitoring and alerts"
}

# Handle script arguments
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Usage: $0 [version] [aws|azure]${NC}"
    echo -e "${YELLOW}Example: $0 v1.0.0 aws${NC}"
    echo -e "${YELLOW}Default: $0 latest aws${NC}"
    exit 0
fi

# Run main function
main
