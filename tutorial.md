# AI Legal Mate - Complete Setup Tutorial

This comprehensive tutorial will guide you through setting up, configuring, and running the AI Legal Mate application with all its features.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Mobile App Setup](#mobile-app-setup)
5. [Database Configuration](#database-configuration)
6. [Environment Variables](#environment-variables)
7. [AI & Pinecone Setup](#ai--pinecone-setup)
8. [Payment Integration Setup](#payment-integration-setup)
9. [Push Notifications Setup](#push-notifications-setup)
10. [Running the Applications](#running-the-applications)
11. [Security Best Practices](#security-best-practices)

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Git
- Access to Supabase (for database)
- Access to OpenAI API (for GPT-4)
- Access to Pinecone (for vector search)
- Access to Stripe (for payments)
- Access to Firebase (for push notifications)

## Backend Setup

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Configure environment variables (see Environment Variables section)

### 5. Start the backend server
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to the frontend directory
```bash
cd public/web
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Configure environment variables (see Environment Variables section)

### 5. Start the frontend development server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Mobile App Setup

### 1. Navigate to the mobile directory
```bash
cd frontend-mobile
```

### 2. Install mobile dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Configure environment variables (see Environment Variables section)

### 5. Start the React Native development server
```bash
npx react-native run-android
# OR for iOS
npx react-native run-ios
```

## Database Configuration

### 1. Create a Supabase project
- Go to [Supabase](https://supabase.com) and create an account
- Create a new project
- Note down the project URL and API keys

### 2. Set up the database schema
Execute the SQL in `backend/config/database_schema.sql` in your Supabase SQL editor

### 3. Configure Row Level Security (RLS)
The schema includes RLS policies. Enable RLS on the tables as defined in the schema.

## Environment Variables

### Backend (.env)
```
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=legal-documents

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_firebase_private_key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Encryption Key
ENCRYPTION_KEY=your_32_char_encryption_key_here
```

### Frontend (.env)
```
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_publishable_key

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# Pinecone Configuration
REACT_APP_PINECONE_ENVIRONMENT=your_pinecone_environment
```

### Mobile (.env)
```
# Backend API URL
API_URL=http://10.0.2.2:5000  # Use 10.0.2.2 for Android emulator to access localhost

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Pinecone Configuration
PINECONE_ENVIRONMENT=your_pinecone_environment
```

## AI & Pinecone Setup

### 1. OpenAI API
- Go to [OpenAI](https://platform.openai.com/api-keys) and create an API key
- Add it to the environment variables as `OPENAI_API_KEY`

### 2. Pinecone Vector Database
- Go to [Pinecone](https://www.pinecone.io) and create an account
- Create a new index named `legal-documents`
- Add your API key and index name to the environment variables

### 3. Configure AI services
The AI services are already configured in `backend/services/aiService.js`

## Payment Integration Setup

### 1. Stripe
- Go to [Stripe](https://dashboard.stripe.com/register) and create an account
- Get your API keys from the Dashboard
- Add them to environment variables:

```
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Midtrans (for Indonesian payments)
- Go to [Midtrans](https://dashboard.midtrans.com/register) and create an account
- Get your server key and client key
- Add them to environment variables:

```
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

### 3. Configure payment webhooks
- Set up webhook endpoints in your payment provider dashboards
- For Stripe: `/api/payments/webhook`
- For Midtrans: Configure in the dashboard

## Push Notifications Setup

### 1. Firebase
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project or use an existing one
- Enable Cloud Messaging and set up your configuration
- Download the service account key and add credentials to environment variables

### 2. Configure push notifications
The Firebase service is already set up in `backend/services/notificationService.js`

## Running the Applications

### Method 1: Run each service separately

1. **Backend:**
```bash
cd backend
npm run dev
```

2. **Frontend:**
```bash
cd public/web
npm start
```

3. **Mobile:**
```bash
cd frontend-mobile
npx react-native run-android
# OR for iOS
npx react-native run-ios
```

### Method 2: Run all services (if you have concurrently installed)
```bash
npm run dev
```

## Security Best Practices

### 1. Environment Security
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate API keys regularly

### 2. Authentication & Authorization
- JWT tokens are used for authentication
- Role-based access control is implemented
- Passwords are hashed using bcrypt
- Secure HTTP headers are implemented

### 3. Data Security
- All sensitive data is encrypted in the database
- HTTPS is enforced for all API endpoints
- Input validation is implemented
- Protection against SQL injection, XSS, and CSRF

### 4. API Security
- Rate limiting is implemented
- CORS is configured for specific origins
- API endpoints are protected with authentication middleware

## Key Features Setup

### 1. AI Legal Assistant
- Powered by GPT-4 technology
- Uses Pinecone for vector search and context retrieval
- Can analyze legal documents, contracts, and provide legal advice
- Implements RAG (Retrieval Augmented Generation) for accurate responses

### 2. Document Management
- Secure upload and storage of legal documents
- Implements encryption for sensitive files
- Supports multiple file types (PDF, DOC, DOCX, TXT)

### 3. Case Management
- Track cases with status, priority, and deadlines
- Automated notifications for important dates
- Progress tracking and updates

### 4. Legal Education
- Interactive modules and courses
- Quizzes and assessments
- Progress tracking

### 5. Consultation Booking
- Schedule appointments with legal professionals
- Integrated payment processing
- Automated reminders

### 6. Community Q&A
- Platform for users to ask legal questions
- Expert answers from legal professionals
- Voting and reputation system

## Development Workflow

### Adding New Features
1. Create feature branches from the main branch
2. Implement the feature with proper testing
3. Update environment variables if needed
4. Document changes in README if necessary

### API Endpoints
- All APIs follow RESTful conventions
- Authentication required for user-specific operations
- Proper error handling and validation implemented

## Troubleshooting

### Common Issues

1. **CORS errors**: Check frontend URL in backend environment variables
2. **Database connection**: Verify Supabase URL and keys
3. **AI responses failing**: Check OpenAI API key and billing
4. **Payment issues**: Verify Stripe/Midtrans keys and webhook configuration
5. **Push notifications not working**: Check Firebase configuration

### Debugging
- Enable logging in development to trace API calls
- Use Postman or similar tools to test API endpoints directly
- Check browser console for frontend errors
- Monitor network requests for API issues

## Production Deployment

### 1. Environment Setup
- Change `NODE_ENV` to `production`
- Use production-level API keys
- Enable SSL certificates

### 2. Database
- Enable RLS policies in production
- Set up proper backup procedures
- Optimize queries for performance

### 3. AI Services
- Configure proper rate limiting for API usage
- Set up monitoring for AI response times
- Plan for API costs

### 4. Security
- Implement proper firewall rules
- Set up DDoS protection
- Regular security audits

## Updating the Application

### 1. Backend Updates
```bash
cd backend
npm install [package-name]
# Update package.json as needed
npm run dev
```

### 2. Frontend Updates
```bash
cd public/web
npm install [package-name]
# Update package.json as needed
npm start
```

### 3. Mobile Updates
```bash
cd frontend-mobile
npm install [package-name]
# Update package.json as needed
npx react-native run-android
```

## Support

For technical support:
- Check the GitHub repository for known issues
- Open a GitHub issue for bugs or feature requests
- Contact the development team through the provided channels

This tutorial provides everything needed to set up and run the AI Legal Mate application successfully. Ensure all environment variables are properly configured before running the application.