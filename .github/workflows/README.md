# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for automated testing, building, and deployment.

## Workflows

### CI Pipeline (`.github/workflows/ci.yml`)

Automatically runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- **build** - Builds the Next.js application with linting, type checking, and production build
- **check-migrations** - Ensures database migrations are properly generated and committed
- **security-audit** - Runs npm audit for vulnerability scanning

### Deploy Pipeline (`.github/workflows/deploy.yml`)

Manual trigger workflow for deploying to staging or production.

**Jobs:**
- **deploy** - Builds and deploys the Next.js app to Netlify
- **deploy-api** - Deploys the Python API to Railway/Render

## Required Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key

### Authentication
- `NEXTAUTH_SECRET` - NextAuth.js secret (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Production URL (e.g., https://your-domain.com)

### Database
- `DATABASE_URL` - Neon/PostgreSQL connection string

### AWS S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_S3_BUCKET` - S3 bucket name

### AI Services
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Generative AI API key

### Background Jobs
- `INNGEST_EVENT_KEY` - Inngest event key
- `INNGEST_SIGNING_KEY` - Inngest signing key

### Deployment (for deploy.yml)
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `NETLIFY_SITE_ID` - Netlify site ID
- `RAILWAY_TOKEN` - Railway token (for API deployment)
- `RENDER_TOKEN` - Render token (alternative for API deployment)

## Branch Protection

For production deployments, set up branch protection rules:

1. Go to Settings > Branches > Add rule
2. Set "Branch name pattern" to `main`
3. Require status checks to pass before merging
4. Require pull request reviews

## Running Workflows

### CI Pipeline
The CI pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Deploy Pipeline
1. Go to Actions tab
2. Select "Deploy to Production"
3. Click "Run workflow"
4. Select environment (staging/production)
5. Click "Run workflow"