# AWS Lambda Integration with OpenAI API

Welcome! You've found your way to our lovely serverless API, thoughtfully crafted with AWS Lambda, API Gateway, and OpenAI's ChatGPT. It dispenses profound, albeit occasionally passive-aggressive, nuggets of wisdom. Congratulations, we guess.

## Features
- Secure retrieval of API keys from AWS SSM Parameter Store (because security is a thing, surprisingly).
- Clever prompt customization using sneaky encoded hints. Don't worry; your secrets are safe... mostly.
- RESTful API endpoint secured with an API Gateway API key. Yes, we locked it down—sorry, not sorry.

## Prerequisites (Sorry, nothing's easy)

- AWS Account and credentials. (Really hoping you already knew this.)
- Node.js and npm. If you haven't figured this out yet, good luck.
- AWS CDK (`npm install -g aws-cdk`). Seriously, just run it.
- OpenAI API key securely stored in AWS Systems Manager Parameter Store. Because leaking secrets is generally frowned upon.

## Installation & Deployment (Brace yourself)

### Step 1: Clone the repo

```bash
git clone <repo-url>
cd <repo-name>
npm install
```

Wasn't so bad, was it?

### Step 2: Stash your OpenAI API key

Replace `<your-api-key>` with your actual key (obviously):

```bash
aws ssm put-parameter \
  --name "/openai/api-key" \
  --value "<your-api-key>" \
  --type "SecureString"
```

### Step 3: Deploy (Cross your fingers)

Deploy with AWS CDK. We believe in you:

```bash
npm run build
cdk deploy
```

Once deployed, you'll get your precious API endpoint and key.

## Using the API (Yes, there's a catch)

Make a GET request. Just remember, nothing is free—provide your API key:

```bash
curl -H "x-api-key: <YOUR_API_KEY>" https://<api-endpoint>/wisdom
```

### Example Response (Enjoy your moment of zen)

```json
{
  "wisdom": "Community matters—especially when certain people (Matthew) conveniently forget this while chasing nomadic fantasies."
}
```

## Troubleshooting (Because you might mess this up)

- **429 Errors:** Stop spamming the API. Or just raise your OpenAI rate limits.
- **403 Errors:** You're probably using the wrong API key. Check again.

## Security Tips (Because someone always ignores these)

- Don't expose your API keys publicly. Ever.
- Keep sensitive data in AWS Parameter Store. It's literally its job.
- Secure your endpoints—unless you enjoy chaos.

## License

MIT. Take it, love it, or leave it. We're indifferent.


