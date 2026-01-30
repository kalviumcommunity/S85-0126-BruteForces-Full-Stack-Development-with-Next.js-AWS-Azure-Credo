# Docker Deployment Script for Credo Application (PowerShell)
# Supports both AWS ECS and Azure App Service deployment

param(
    [string]$Version = "latest",
    [string]$Target = "aws"  # aws or azure
)

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Write-Status {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

function Check-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    # Check Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed or not in PATH"
        exit 1
    }
    
    # Check AWS CLI if deploying to AWS
    if ($Target -eq "aws") {
        if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
            Write-Error "AWS CLI is not installed or not in PATH"
            exit 1
        }
        
        # Check AWS credentials
        try {
            aws sts get-caller-identity | Out-Null
        } catch {
            Write-Error "AWS credentials not configured"
            exit 1
        }
    }
    
    # Check Azure CLI if deploying to Azure
    if ($Target -eq "azure") {
        if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
            Write-Error "Azure CLI is not installed or not in PATH"
            exit 1
        }
        
        # Check Azure login
        try {
            az account show | Out-Null
        } catch {
            Write-Error "Not logged in to Azure. Run 'az login' first."
            exit 1
        }
    }
    
    Write-Status "Prerequisites check passed ✓"
}

function Build-Image {
    Write-Status "Building Docker image..."
    
    $AppName = "credo-app"
    
    # Build the image
    docker build -t "${AppName}:${Version}" .
    docker tag "${AppName}:${Version}" "${AppName}:latest"
    
    Write-Status "Docker image built successfully ✓"
}

function Deploy-To-AWS {
    Write-Status "Deploying to AWS ECS..."
    
    $AppName = "credo-app"
    $AWS_REGION = $env:AWS_REGION ?? "us-east-1"
    
    # Get AWS account ID and region
    $AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
    $ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    $ECR_REPOSITORY = $AppName
    
    Write-Status "Using ECR registry: ${ECR_REGISTRY}"
    
    # Login to ECR
    Write-Status "Logging into Amazon ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
    
    # Tag image for ECR
    docker tag "${AppName}:${Version}" "${ECR_REGISTRY}/${ECR_REPOSITORY}:${Version}"
    docker tag "${AppName}:latest" "${ECR_REGISTRY}/${ECR_REPOSITORY}:latest"
    
    # Push to ECR
    Write-Status "Pushing image to ECR..."
    docker push "${ECR_REGISTRY}/${ECR_REPOSITORY}:${Version}"
    docker push "${ECR_REGISTRY}/${ECR_REPOSITORY}:latest"
    
    # Update task definition
    Write-Status "Updating ECS task definition..."
    $TaskDefContent = Get-Content "aws/ecs-task-definition.json" -Raw
    $TaskDefContent = $TaskDefContent -replace 'ACCOUNT_ID', $AWS_ACCOUNT_ID
    $TaskDefContent = $TaskDefContent -replace 'REGION', $AWS_REGION
    $TaskDefContent | Out-File -FilePath "/tmp/task-definition.json" -Encoding UTF8
    
    $TASK_DEF_ARN = aws ecs register-task-definition --cli-input-json file:///tmp/task-definition.json --query taskDefinition.taskDefinitionArn --output text
    
    # Update service
    Write-Status "Updating ECS service..."
    aws ecs update-service `
        --cluster "${AppName}-cluster" `
        --service "${AppName}-service" `
        --task-definition $TASK_DEF_ARN
    
    # Wait for service stability
    Write-Status "Waiting for service to stabilize..."
    aws ecs wait services-stable `
        --cluster "${AppName}-cluster" `
        --services "${AppName}-service"
    
    Write-Status "AWS ECS deployment completed successfully ✓"
}

function Deploy-To-Azure {
    Write-Status "Deploying to Azure App Service..."
    
    $AppName = "credo-app"
    $AZURE_RESOURCE_GROUP = $env:AZURE_RESOURCE_GROUP ?? "credo-rg"
    $ACR_REGISTRY = $env:ACR_REGISTRY ?? "credoRegistry"
    
    # Get Azure subscription info
    $AZURE_SUBSCRIPTION = az account show --query name --output tsv
    
    Write-Status "Using Azure subscription: ${AZURE_SUBSCRIPTION}"
    Write-Status "Using resource group: ${AZURE_RESOURCE_GROUP}"
    
    # Login to ACR
    Write-Status "Logging into Azure Container Registry..."
    az acr login --name $ACR_REGISTRY
    
    # Tag image for ACR
    $ACR_IMAGE_NAME = "${ACR_REGISTRY}.azurecr.io/${AppName}"
    docker tag "${AppName}:${Version}" "${ACR_IMAGE_NAME}:${Version}"
    docker tag "${AppName}:latest" "${ACR_IMAGE_NAME}:latest"
    
    # Push to ACR
    Write-Status "Pushing image to ACR..."
    docker push "${ACR_IMAGE_NAME}:${Version}"
    docker push "${ACR_IMAGE_NAME}:latest"
    
    # Update App Service
    Write-Status "Updating Azure App Service..."
    az webapp config container set `
        --resource-group $AZURE_RESOURCE_GROUP `
        --name $AppName `
        --docker-custom-image-name "${ACR_IMAGE_NAME}:${Version}" `
        --docker-registry-server-url "https://${ACR_REGISTRY}.azurecr.io"
    
    # Restart the app service
    Write-Status "Restarting App Service..."
    az webapp restart --resource-group $AZURE_RESOURCE_GROUP --name $AppName
    
    # Wait for deployment
    Write-Status "Waiting for deployment to complete..."
    Start-Sleep -Seconds 30
    
    Write-Status "Azure App Service deployment completed successfully ✓"
}

function Test-Health {
    Write-Status "Running health check..."
    
    $AppName = "credo-app"
    
    if ($Target -eq "aws") {
        # Get load balancer URL
        try {
            $ALB_DNS = aws elbv2 describe-load-balancers `
                --names "${AppName}-lb" `
                --query 'LoadBalancers[0].DNSName' `
                --output text 2>$null
            
            if ($ALB_DNS) {
                $HealthUrl = "http://${ALB_DNS}/api/health"
            } else {
                Write-Warning "Could not find load balancer URL"
                return
            }
        } catch {
            Write-Warning "Could not find load balancer URL"
            return
        }
    } else {
        # Get App Service URL
        $AZURE_RESOURCE_GROUP = $env:AZURE_RESOURCE_GROUP ?? "credo-rg"
        $APP_URL = az webapp show `
            --resource-group $AZURE_RESOURCE_GROUP `
            --name $AppName `
            --query defaultHostName `
            --output tsv
        
        $HealthUrl = "https://${APP_URL}/api/health"
    }
    
    Write-Status "Checking health at: ${HealthUrl}"
    
    # Wait and check
    for ($i = 1; $i -le 10; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Status "Health check passed ✓"
                return
            }
        } catch {
            # Continue to retry
        }
        
        Write-Warning "Health check attempt ${i}/10 failed, retrying in 10 seconds..."
        Start-Sleep -Seconds 10
    }
    
    Write-Error "Health check failed after 10 attempts"
}

function Clean-Up {
    Write-Status "Cleaning up temporary files..."
    if (Test-Path "/tmp/task-definition.json") {
        Remove-Item "/tmp/task-definition.json" -Force
    }
}

# Main deployment flow
try {
    # Set up cleanup
    $originalErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Stop"
    
    try {
        # Check prerequisites
        Check-Prerequisites
        
        # Build image
        Build-Image
        
        # Deploy based on target
        switch ($Target) {
            "aws" {
                Deploy-To-AWS
            }
            "azure" {
                Deploy-To-Azure
            }
            default {
                Write-Error "Invalid deployment target. Use 'aws' or 'azure'"
                exit 1
            }
        }
        
        # Run health check
        Test-Health
        
        Write-Status "Deployment completed successfully! 🎉"
        
        # Show next steps
        Write-ColorOutput "`n📋 Next steps:" "Blue"
        Write-ColorOutput "1. Monitor your deployment in the ${Target} console" "White"
        Write-ColorOutput "2. Check application logs for any issues" "White"
        Write-ColorOutput "3. Test the application functionality" "White"
        Write-ColorOutput "4. Set up monitoring and alerts" "White"
        
    } finally {
        Clean-Up
    }
} catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    exit 1
} finally {
    $ErrorActionPreference = $originalErrorActionPreference
}
