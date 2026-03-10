# CREO-AI

An AI-powered creative platform that leverages advanced language models and vision capabilities to help users generate, optimize, and analyze content with conversational intelligence.

## Features

- **Conversational AI**: Chat-based interface for interactive content generation and analysis
- **Vision Analysis**: Image processing and analysis powered by AWS Bedrock Vision Models
- **Content Creation**: Generate and optimize creative content
- **Analytics Dashboard**: Track and visualize performance metrics
- **Team Management**: Collaborate with team members
- **Best Time Analysis**: Optimize posting times for maximum engagement
- **User Authentication**: Secure login and session management
- **AWS Integration**: Seamless integration with AWS services (Bedrock, DynamoDB, S3)

## Tech Stack

### Frontend
- **Next.js** - React framework with file-based routing
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library

### Backend
- **Next.js API Routes** - Server-side logic
- **AWS Bedrock** - LLM and Vision models
- **AWS DynamoDB** - NoSQL database
- **AWS S3** - File storage
- **AWS Transcribe** - Audio transcription (optional)

### Development
- **ESLint** - Code linting
- **AWS Amplify** - Deployment and CI/CD

## Project Structure

```
CREO-AI/
├── creo-ai/                    # Main Next.js application
│   ├── app/                    # Next.js app directory (routing, layouts)
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── content/           # Content creation
│   │   ├── create/            # Creation tools
│   │   ├── history/           # History/past items
│   │   ├── login/             # Authentication
│   │   ├── settings/          # User settings
│   │   ├── team/              # Team management
│   │   ├── best-time/         # Best time analysis
│   │   └── x-analytics/       # Analytics
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utility functions and clients
│   ├── services/             # Business logic services
│   ├── types/                # TypeScript type definitions
│   ├── public/               # Static assets
│   └── styles/               # Global styles
├── amplify.yml               # Amplify configuration
└── package.json              # Root package configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- AWS Account with Bedrock, DynamoDB, and S3 access
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CREO-AI
```

2. Install dependencies:
```bash
cd creo-ai
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the `creo-ai` directory with the following variables:

```env
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Database
DYNAMODB_TABLE_CONVERSATIONS=conversations
DYNAMODB_TABLE_USERS=users

# S3
S3_BUCKET_NAME=your_bucket_name

# Vision API (optional)
VISION_API_KEY=your_vision_api_key
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/callback` - OAuth callback

### Core Features
- `POST /api/agent` - Agent/AI interactions
- `POST /api/conversation/generate` - Generate conversational responses
- `GET /api/conversation/status` - Get conversation status
- `POST /api/conversation/answer` - Submit answers in conversation
- `GET /api/conversation/x-analytics` - Get conversation analytics
- `POST /api/transcribe` - Transcribe audio files
- `POST /api/transcribe/token` - Get transcription token
- `POST /api/image` - Process images
- `POST /api/vision-generate` - Generate content from images
- `GET /api/dashboard` - Get dashboard data
- `GET /api/best-time` - Analyze best posting times
- `GET /api/history` - Get user history

## Services

The application includes several specialized services:

- **aiService.ts** - AI model interactions
- **visionService.ts** - Image analysis and vision tasks
- **conversationalService.ts** - Conversation management
- **analyticsService.ts** - Analytics and metrics
- **optimizationService.ts** - Content optimization
- **scoringService.ts** - Scoring and ranking
- **imageService.ts** - Image processing

## Utilities & Middleware

- **authMiddleware.ts** - Request authentication
- **authUtils.ts** - Authentication helpers
- **bedrockClient.ts** - AWS Bedrock client
- **dynamoClient.ts** - DynamoDB client
- **utils.ts** - General utilities

## Deployment

### AWS Amplify

Deploy using AWS Amplify:
```bash
amplify init
amplify push
amplify publish
```

Amplify configuration is defined in `amplify.yml`

## Contributing

1. Create a feature branch (`git checkout -b feature/feature-name`)
2. Commit your changes (`git commit -m 'Add feature'`)
3. Push to the branch (`git push origin feature/feature-name`)
4. Create a Pull Request

## License

This project is proprietary. Unauthorized copying or distribution is prohibited.

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

**Last Updated**: March 2026
