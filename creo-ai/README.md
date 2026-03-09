# 🚀 CREO-AI

**Transform your ideas into high-performing social media content with the power of AWS Bedrock.**

CREO-AI is a state-of-the-art SaaS platform designed for creators, marketers, and brands. It leverages advanced Generative AI to create, score, and optimize content across multiple platforms and languages, ensuring every post makes an impact.

---

## ✨ Key Features

-   **🤖 Multi-Model Content Generation** – Powered by AWS Bedrock (Amazon Nova, Anthropic Claude 3.5).
-   **📈 AI Content Scoring** – Real-time feedback on **Hook**, **Clarity**, and **Call-to-Action (CTA)**.
-   **🌍 Cultural & Regional Intelligence** – Localization beyond translation, focusing on cultural nuances and Indic languages.
-   **📸 Vision-to-Post** – Generate engaging captions and hashtags automatically from uploaded images.
-   **📊 Analytics Dashboard** – Track your content performance and engagement trends.
-   **🔐 Secure Enterprise Auth** – Built-in authentication with AWS Cognito.
-   **⚡ High Performance** – Modern Next.js App Router architecture for speed and SEO.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/) |
| **AI Engine** | [AWS Bedrock](https://aws.amazon.com/bedrock/) (Nova Lite, Nova Pro, Claude 3.5 Sonnet) |
| **Database** | [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) |
| **Auth** | [Amazon Cognito](https://aws.amazon.com/cognito/) |
| **Storage** | [Amazon S3](https://aws.amazon.com/s3/) |
| **Deployment** | [AWS Amplify](https://aws.amazon.com/amplify/) |

---

## 🚀 Getting Started

### 1. Prerequisites

-   Node.js 18.x or later
-   AWS Account with Bedrock model access enabled (us-east-1)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/CREO-AI.git
cd CREO-AI/creo-ai

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (use `.env.local.example` as a template):

```env
# AWS Configuration
CREO_AWS_REGION=us-east-1
CREO_AWS_ACCESS_KEY_ID=your_access_key
CREO_AWS_SECRET_ACCESS_KEY=your_secret_key

# Cognito Configuration
COGNITO_CLIENT_ID=your_client_id
COGNITO_USER_POOL_ID=your_pool_id

# DynamoDB Tables
POSTS_TABLE=Posts
OPTIMIZATIONS_TABLE=Optimizations
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## 🔒 Security Note

> [!CAUTION]
> **API Keys Exposed?** If you have accidentally committed secrets to GitHub:
> 1. **Rotate your keys** immediately in the AWS Console.
> 2. Use a tool like [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git-filter-repo` to purge sensitive data from your git history.
> 3. Ensure `.env` is always in your `.gitignore`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the CREO-AI Team.
