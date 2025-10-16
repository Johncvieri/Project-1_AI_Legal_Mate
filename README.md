# AI Legal Mate

AI Legal Mate is a comprehensive end-to-end legal application designed for legal cases in Indonesia. It features an AI Legal Assistant powered by GPT-4, case management, legal education modules, document search and summarization, contract analysis, consultation booking, and community Q&A functionality.

## Features

- **AI Legal Assistant**: Get answers to legal questions powered by GPT-4 and Pinecone vector search
- **Interactive Legal Education**: Modules, case studies, quizzes, and tutorials
- **Case Management**: Track cases with progress updates, reminders, and risk analysis
- **Paid Consultation Booking**: Secure payment integration for legal consultations
- **Legal Document Search & Summarization**: Find and summarize legal documents quickly
- **AI Contract Analyzer**: Analyze contracts for risks and obligations
- **Legal Form Generator**: Generate common legal forms
- **Community Q&A**: Connect with legal experts and fellow users
- **Push Notifications**: Updates and deadline reminders

## Tech Stack

### Backend
- Node.js/Express
- Supabase (PostgreSQL database)
- OpenAI API (GPT-4)
- Pinecone (Vector search)
- Stripe/Midtrans (Payment processing)
- Firebase (Push notifications)
- n8n (Workflow automation)

### Frontend
- React (Web Application)
- React Native (Mobile Application)
- Supabase client
- OpenAI client
- Stripe React components

### Security Features
- JWT-based authentication
- Role-based authorization
- Encrypted storage
- HTTPS enforcement
- Input validation
- SQL injection and XSS protection

## Architecture

The application follows a microservice architecture with separate services for:
- Authentication and user management
- Case management
- Document management
- AI processing
- Payment processing
- Notification system

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ai-legal-mate.git
cd ai-legal-mate
```

2. Install dependencies for each service:
```bash
# Backend
cd backend
npm install

# Frontend
cd public/web
npm install

# Mobile
cd frontend-mobile
npm install
```

3. Set up environment variables (see tutorial.md for details)

4. Initialize the database (see database_schema.sql)

5. Run the applications:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd public/web
npm start

# Mobile
cd frontend-mobile
npx react-native run-android
```

## Documentation

- [Complete Setup Tutorial](tutorial.md)
- [Deployment Guide](docs/deployment.md)
- [API Documentation](docs/api.md)
- [Security Guidelines](docs/security.md)
- [Payment Integration](docs/payment.md)

## Environment Variables

The application requires various environment variables for different services. See the `.env.example` files in each service directory for required variables.

## Database Schema

The application uses PostgreSQL via Supabase with the following main tables:
- `users`: User accounts and profiles
- `cases`: Legal case tracking
- `documents`: Legal documents storage
- `ai_interactions`: AI query/response history
- `contract_analyses`: Contract analysis results
- `payments`: Payment transactions
- `consultations`: Consultation bookings
- `notifications`: Push notifications
- `education_modules`: Legal education content
- `community_questions`: Community Q&A
- `legal_templates`: Legal document templates

## AI Integration

The application leverages:
- OpenAI GPT-4 for legal question answering
- Pinecone vector database for document retrieval
- Custom legal knowledge base

## Payment Integration

Supports both international (Stripe) and Indonesian (Midtrans) payment gateways.

## Mobile Application

The React Native mobile app provides all core functionality on mobile devices with offline capabilities where possible.

## Security

- All sensitive data is encrypted
- JWT tokens with proper expiration
- Input validation and sanitization
- Secure API endpoints
- Role-based access control

## Development

### Adding New Features
1. Create feature branches from the main branch
2. Implement the feature with proper testing
3. Update environment variables if needed
4. Document changes in README if necessary

### API Endpoints
All APIs follow RESTful conventions with proper authentication and error handling.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support, please open an issue in the GitHub repository.

---

AI Legal Mate is designed to make legal services more accessible and efficient through AI technology while maintaining security and compliance with Indonesian legal requirements.