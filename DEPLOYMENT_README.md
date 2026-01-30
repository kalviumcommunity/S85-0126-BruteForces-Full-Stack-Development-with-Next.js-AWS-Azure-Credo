# Docker Deployment Guide (AWS ECS / Azure App Service)

This guide covers the complete deployment process for containerizing the Next.js Credo application using Docker and deploying it to managed cloud services.

## 🎯 Overview

This deployment strategy includes:
- **Multi-stage Docker build** for optimized production images
- **AWS ECS Fargate** deployment with auto-scaling
- **Azure App Service** deployment with container support
- **CI/CD pipelines** using GitHub Actions
- **Health monitoring** and automated rollbacks
- **Security best practices** and cost optimization

## 🐳 Docker Configuration

### Multi-Stage Build Strategy

Our Dockerfile uses a two-stage build process:

1. **Builder Stage**: Installs dependencies and builds the application
2. **Runner Stage**: Creates a minimal production image with only necessary files

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# ... build process

# Stage 2: Production
FROM node:20-alpine AS runner
# ... minimal runtime
```

### Key Features

- **Non-root user** for security
- **Health checks** for container monitoring
- **Optimized layer caching** for faster builds
- **Minimal image size** (~200MB compressed)

## 🚀 Deployment Options

### Option 1: AWS ECS (Fargate)

#### Prerequisites
- AWS CLI configured
- ECR repository created
- IAM roles for ECS execution and tasks
- VPC with subnets and security groups

#### Deployment Steps

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name credo-app --region us-east-1
   ```

2. **Build and Push Image**
   ```bash
   # Build image
   docker build -t credo-app .
   
   # Tag for ECR
   docker tag credo-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/credo-app:latest
   
   # Push to ECR
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/credo-app:latest
   ```

3. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name credo-cluster
   ```

4. **Register Task Definition**
   ```bash
   aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition.json
   ```

5. **Create Service**
   ```bash
   aws ecs create-service --cli-input-json file://aws/ecs-service-definition.json
   ```

#### Auto-Scaling Configuration

```bash
# Create auto-scaling target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/credo-cluster/credo-app-service \
  --min-capacity 1 \
  --max-capacity 10

# Apply scaling policy
aws application-autoscaling put-scaling-policy \
  --cli-input-json file://aws/auto-scaling-policy.json
```

### Option 2: Azure App Service

#### Prerequisites
- Azure CLI installed
- Azure Container Registry created
- Resource group configured

#### Deployment Steps

1. **Create ACR Registry**
   ```bash
   az acr create --resource-group credo-rg --name credoregistry --sku Basic
   ```

2. **Build and Push Image**
   ```bash
   # Build image
   docker build -t credo-app .
   
   # Tag for ACR
   docker tag credo-app credoregistry.azurecr.io/credo-app:latest
   
   # Push to ACR
   docker push credoregistry.azurecr.io/credo-app:latest
   ```

3. **Create App Service**
   ```bash
   az webapp create \
     --resource-group credo-rg \
     --plan credo-plan \
     --name credo-app \
     --deployment-container-image-name credoregistry.azurecr.io/credo-app:latest
   ```

4. **Configure Container Settings**
   ```bash
   az webapp config appsettings set \
     --resource-group credo-rg \
     --name credo-app \
     --settings WEBSITES_PORT=3000 NODE_ENV=production
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The pipeline includes:

1. **Testing Phase**
   - Code linting
   - Type checking
   - Build validation

2. **Deployment Phase**
   - Docker image build
   - Container registry push
   - Service deployment
   - Health verification

3. **Rollback Phase**
   - Automatic rollback on failure
   - Notification system

#### Required Secrets

**For AWS:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

**For Azure:**
- `AZURE_CREDENTIALS`
- `AZURE_REGISTRY_USERNAME`
- `AZURE_REGISTRY_PASSWORD`
- `AZURE_RESOURCE_GROUP`

## 📊 Monitoring and Health Checks

### Health Check Endpoints

- **Application Health**: `/api/health`
- **Database Status**: `/api/test-db`
- **System Metrics**: `/api/metrics`

### Container Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### Monitoring Tools

- **AWS CloudWatch** for ECS deployments
- **Azure Monitor** for App Service
- **Application Insights** for performance monitoring
- **Log aggregation** with centralized logging

## 🔒 Security Considerations

### Container Security

- **Non-root user** execution
- **Minimal base images** (Alpine Linux)
- **Security scanning** of images
- **Secrets management** through cloud provider

### Network Security

- **VPC isolation** (AWS)
- **Virtual Network** (Azure)
- **Security groups** and **NSG rules**
- **SSL/TLS termination**
- **WAF integration**

### Application Security

- **Environment variables** for sensitive data
- **Rate limiting** at reverse proxy level
- **CORS configuration**
- **Security headers** (HSTS, CSP, etc.)

## 📈 Performance Optimization

### Cold Start Mitigation

1. **Container warming** strategies
2. **Provisioned concurrency** (AWS Lambda)
3. **Always-on** configuration
4. **Connection pooling**

### Resource Optimization

- **CPU/Memory allocation** based on usage patterns
- **Horizontal scaling** with auto-scaling policies
- **CDN integration** for static assets
- **Database connection pooling**

### Caching Strategy

- **Redis cache** for frequent queries
- **Browser caching** headers
- **CDN caching** for static content
- **Application-level caching** with SWR

## 💰 Cost Optimization

### AWS ECS Cost Considerations

| Component | Cost Estimate | Optimization |
|-----------|---------------|--------------|
| Fargate Tasks | $0.04048 per vCPU-hour | Right-sizing, auto-scaling |
| ECR Storage | $0.10 per GB/month | Image optimization |
| Load Balancer | $0.0225 per LCU-hour | Application LB vs Network LB |
| Data Transfer | $0.09 per GB (out) | CloudFront CDN |

### Azure App Service Cost Considerations

| Component | Cost Estimate | Optimization |
|-----------|---------------|--------------|
| App Service Plan | $10-100/month | Choose appropriate tier |
| Container Registry | $7-70/month | Image lifecycle policies |
| Bandwidth | $0.087 per GB | CDN integration |

## 🛠️ Local Development

### Docker Compose Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Service Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Nginx    │    │  Next.js    │    │ PostgreSQL  │
│  (Reverse   │◄──►│   App       │◄──►│  Database   │
│   Proxy)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │    Redis    │
                   │    Cache    │
                   └─────────────┘
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Health checks enabled
- [ ] Monitoring set up
- [ ] Backup strategy implemented

### Post-Deployment

- [ ] Application accessible via URL
- [ ] Health endpoints responding
- [ ] Database connectivity verified
- [ ] Auto-scaling policies active
- [ ] Monitoring alerts configured
- [ ] Performance baseline established

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
   - Check health check configuration
   - Verify environment variables
   - Review container logs

2. **Database connection errors**
   - Validate connection string
   - Check security group rules
   - Verify database availability

3. **High memory usage**
   - Monitor container metrics
   - Check for memory leaks
   - Adjust resource allocation

4. **Slow response times**
   - Review application performance
   - Check database query performance
   - Verify auto-scaling configuration

### Debug Commands

```bash
# AWS ECS
aws ecs describe-tasks --cluster credo-cluster --tasks <task-id>
aws logs get-log-events --log-group-name /ecs/credo-app --log-stream-prefix ecs

# Azure App Service
az webapp log tail --name credo-app --resource-group credo-rg
az webapp config appsettings list --name credo-app --resource-group credo-rg

# Docker
docker logs <container-id>
docker exec -it <container-id> sh
```

## 📚 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## 🔄 Future Enhancements

1. **Multi-region deployment** for high availability
2. **Blue-green deployments** for zero-downtime updates
3. **Canary releases** for gradual rollouts
4. **Advanced monitoring** with APM tools
5. **GitOps** with ArgoCD or Flux
6. **Service mesh** with Istio or Linkerd

---

**Note**: This deployment configuration is production-ready with comprehensive monitoring, security, and scaling capabilities. Always test thoroughly in staging environments before production deployment.
