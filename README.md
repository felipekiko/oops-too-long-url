# OopsTooLongURL

**OopsTooLongURL** is a simple and fun URL shortener built with AWS SAM.  
It turns those *ridiculously long Sharepoint URLs* into short and shareable ones...fast, serverless, and cheap!

## Project Overview

This application is composed of:

- **Frontend**: A static web app (HTML, CSS, JS) hosted on **S3** and distributed via **CloudFront**
- **Backend**: A **serverless API** built with **AWS Lambda**, **API Gateway**, and **DynamoDB**
- **Infrastructure as Code (IaC)**: All resources are defined and deployed using **AWS SAM** templates


## Project Structure

```
├── .gitignore
├── README.md
├── backend
│   ├── samconfig.toml
│   ├── src
│   │   ├── get-link
│   │   │   └── app.py
│   │   └── post-link
│   │       └── app.py
│   └── template.yaml
└── frontend
    ├── index.html
    ├── script.js
    └── style.css
```

## Prerequisites

Make sure you have the following installed:

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Also ensure your AWS credentials are properly configured

## Installation & Deployment

### 1. Deploy the backend
From the *backend/* folder:

```bash
sam build
sam deploy --stack-name oops-too-long-url --guided
```

This will create:
- DynamoDB table for storing short links
- Lambda functions for creating and reading links
- API Gateway for the backend endpoints
- S3 bucket for the frontend (private, only accessible by CloudFront)
- CloudFront distribution that serves the static site

At the end of deployment, two important URLs will appear:
- API URL: for the backend requests
- CloudFront URL: your final site address

Take note of both!

### 2. Deploy the frontend

Update the API_BASE_URL inside *frontend/src/script.js*:

```js
const API_BASE_URL = "https://<your-api-id>.execute-api.<region>.amazonaws.com/Prod";
```

Get the bucket name in the CloudFormation outputs:
```
aws cloudformation describe-stacks \
  --stack-name oops-too-long-url \
  --query "Stacks[0].Outputs[?OutputKey=='WebBucketName'].OutputValue" \
  --output text
```

Then, from the *frontend/* folder run:
```
aws s3 sync . s3://<your-bucket-name> --delete
```

After uploading new frontend files, to invalidate CloudFront cache, run:
```
aws cloudformation describe-stacks \
  --stack-name oops-too-long-url \
  --query "Stacks[0].Outputs[?OutputKey=='WebDistributionId'].OutputValue" \
  --output text
```

Copy the CloudFront Distribution ID, then run:
```
aws cloudfront create-invalidation \
  --distribution-id <your-distribution-id> \
  --paths "/*"
```

This ensures your users always see the latest version of the site

## Usage

Open the CloudFront URL in your browser and paste any long URL and click Shorten...you’ll receive a short URL that redirects to your original one!

## ToDo

- [ ] Auditoria nos elementos
- [ ] Key na API Key
- [ ] CORS
- [ ] Test!
- [ ] Authentication
- [ ] API Requests Limit
- [ ] Architecture Diagram
- [ ] Update README.md
- [ ] Commit
