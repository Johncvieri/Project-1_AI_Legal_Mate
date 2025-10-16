# AI Legal Mate - Deployment Guide

This document provides detailed instructions for deploying the AI Legal Mate application to various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Mobile App Deployment](#mobile-app-deployment)
6. [Database Migration](#database-migration)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Security Considerations](#security-considerations)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Scaling Guidelines](#scaling-guidelines)

## Prerequisites

Before deploying the application, ensure you have:

- Access to a cloud platform (AWS, GCP, Azure, or Vercel/Netlify for frontend)
- Domain name and SSL certificate
- Supabase production database
- Payment provider accounts (Stripe, Midtrans) with production keys
- AI API keys for production
- Firebase project for production
- Container registry (if using Docker)

## Environment Configuration

### Production Environment Variables

#### Backend (.env.production)
```
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_prod_openai_key

# Pinecone Configuration
PINECONE_API_KEY=your_prod_pinecone_key
PINECONE_INDEX_NAME=legal-documents-prod

# JWT Configuration
JWT_SECRET=your_prod_jwt_secret
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=your_prod_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_prod_stripe_webhook_secret
STRIPE_PUBLISHABLE_KEY=your_prod_stripe_publishable_key

# Firebase Configuration
FIREBASE_PROJECT_ID=your_prod_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_prod_firebase_private_key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_prod_firebase_client_email

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Encryption Key
ENCRYPTION_KEY=your_32_char_prod_encryption_key_here
```

#### Frontend (.env.production)
```
# Backend API URL
REACT_APP_API_URL=https://api.yourdomain.com

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_prod_anon_key

# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_prod_openai_key

# Stripe Configuration
REACT_APP_STRIPE_PUBLIC_KEY=your_prod_stripe_publishable_key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_prod_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=yourdomain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

## Backend Deployment

### Option 1: Deploy to Heroku

1. Create a new Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
# ... set all other variables
```

3. Deploy the application:
```bash
git push heroku main
```

### Option 2: Deploy to AWS EC2

1. Launch an EC2 instance with Node.js pre-installed
2. SSH into the instance
3. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-legal-mate.git
cd ai-legal-mate/backend
```
4. Install dependencies:
```bash
npm install --production
```
5. Set environment variables
6. Start the application:
```bash
npm start
```
7. Use a process manager like PM2 for production:
```bash
npm install -g pm2
pm2 start server.js
```

### Option 3: Deploy with Docker

1. Create Dockerfile in backend:
```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

2. Build and deploy:
```bash
docker build -t ai-legal-mate-backend .
docker run -d -p 5000:5000 --env-file .env ai-legal-mate-backend
```

## Frontend Deployment

### Deploy to Netlify

1. Build the frontend:
```bash
cd public/web
npm run build
```

2. Deploy with Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Deploy to AWS S3

1. Build the frontend:
```bash
cd public/web
npm run build
```

2. Create S3 bucket and configure static hosting
3. Upload build files to S3
4. Configure CloudFront for HTTPS and caching

## Mobile App Deployment

### Android

1. Generate signed APK:
```bash
cd frontend-mobile
cd android
./gradlew assembleRelease
```

2. Upload to Google Play Console

### iOS

1. Generate IPA file:
```bash
cd frontend-mobile
cd ios
xcodebuild -workspace AI_Legal_Mate.xcworkspace -scheme AI_Legal_Mate -configuration Release archive
```

2. Upload to App Store Connect

## Database Migration

### Initial Setup
Run the database schema from `backend/config/database_schema.sql` on your production Supabase instance.

### Seeding Data
Use the seed script to populate initial data:
```bash
npm run seed
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd backend
        npm install
        
    - name: Run tests
      run: |
        cd backend
        npm test
        
    - name: Deploy to production
      run: |
        # Your deployment commands here
        echo "Deploying to production..."
```

## Security Considerations

### 1. Environment Secrets
- Never commit environment variables to version control
- Use encrypted secrets in CI/CD pipelines
- Regularly rotate API keys

### 2. API Security
- Implement rate limiting
- Use HTTPS only
- Validate and sanitize all inputs
- Implement proper authentication and authorization

### 3. Data Security
- Encrypt sensitive data at rest
- Use secure connections to database
- Implement proper access controls
- Regular security audits

### 4. Infrastructure Security
- Update dependencies regularly
- Use security scanning tools
- Implement network security groups/firewalls
- Regular vulnerability assessments

## Monitoring and Logging

### Application Monitoring

1. **Backend:**
   - Implement comprehensive logging
   - Monitor API response times
   - Track error rates
   - Set up alerts for critical issues

2. **Frontend:**
   - Monitor page load times
   - Track user interactions
   - Monitor error rates
   - Performance monitoring

### Recommended Tools
- **Logging:** Winston, Bunyan, or Pino for Node.js
- **Monitoring:** New Relic, DataDog, or AWS CloudWatch
- **Error Tracking:** Sentry
- **Performance:** Lighthouse, WebPageTest

### Log Management
Implement structured logging with appropriate log levels:
```javascript
// Example logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Scaling Guidelines

### Horizontal Scaling
- Use load balancers to distribute traffic
- Implement stateless services
- Use external session stores
- Scale database connections appropriately

### Database Scaling
- Use connection pooling
- Implement read replicas
- Optimize queries with proper indexing
- Consider database sharding for large datasets

### Caching Strategy
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets
- Implement API response caching

### Auto-scaling Configuration
Configure auto-scaling based on:
- CPU utilization
- Memory usage
- Request rate
- Response time

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Verify environment variable names match exactly
   - Check that variables are properly set in deployment environment

2. **Database Connection Issues**
   - Verify database URL and credentials
   - Check firewall rules and connection limits
   - Ensure SSL is properly configured

3. **API Rate Limits**
   - Monitor API usage against rate limits
   - Implement retry logic with exponential backoff
   - Consider caching to reduce API calls

4. **Deployment Failures**
   - Check logs for detailed error messages
   - Verify all dependencies are specified correctly
   - Ensure sufficient resources (memory, storage)

## Rollback Procedures

### Automated Rollback
Implement automated rollback procedures for failed deployments:
1. Monitor health checks after deployment
2. Roll back automatically if health checks fail
3. Alert team of rollback occurrence

### Manual Rollback
1. Keep previous version artifacts
2. Maintain database migration scripts for rollback
3. Document manual rollback procedures

## Performance Optimization

### Backend Optimization
- Optimize database queries
- Implement caching strategies
- Use async operations where appropriate
- Compress responses

### Frontend Optimization
- Optimize bundle size
- Implement code splitting
- Use lazy loading
- Optimize images and assets

## Backup and Recovery

### Database Backup
- Implement automated database backups
- Store backups in secure, geographically distributed locations
- Test backup restoration procedures regularly

### Application Backup
- Version control for application code
- Infrastructure as code for environment recreation
- Regular snapshots of running systems

This deployment guide provides comprehensive instructions for deploying the AI Legal Mate application to production environments. Follow these steps carefully to ensure a successful and secure deployment.