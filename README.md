# NexxAgent

> A multi-agent system that turns a prompt into a working frontend UI: generated, edited live in a browser editor, and deployed to Netlify.

## What is NexxAgent?

NexxAgent is a microservices-based, multi-agent platform. Users describe the UI they want, a team of AI agents plans and generates the code, and the result appears in a live in-browser editor. When the user is happy, one click deploys the site to **Netlify**.

## Features

* **Multi-agent UI generation**: orchestrated agents plan, write and refine frontend code
* **Live code editor**: real-time editing and updates over **Socket.IO**
* **Sandboxed execution**: generated code runs in an isolated sandbox service
* **One-click deploy to Netlify**: publish generated sites directly
* **Authentication**: Passport.js based login with OAuth avatar support
* **Notifications**: async notification service built on RabbitMQ
* **Learn by Building**: interactive guided experience for new users
* **Cloud-native**: Docker, Kubernetes manifests, Skaffold for local development, and S3-backed production deployment

## Architecture

```text
                        ┌──────────────┐
                        │   Frontend   │
                        │ React + Vite │
                        │   + Tailwind │
                        └──────┬───────┘
                               │
                         REST / Socket.IO
                               │
                        ┌──────▼───────┐
                        │    Ingress   │
                        │ nginx / k8s  │
                        └──────┬───────┘
                               │
        ┌──────────────┬───────┴────────┬─────────────────┐
        ▼              ▼                ▼                 ▼
 ┌────────────┐ ┌──────────────┐ ┌─────────────┐  ┌─────────────┐
 │    Auth    │ │     AI       │ │   Sandbox   │  │Notification │
 │  service   │ │ Orchestration│ │   service   │  │   service   │
 │ Passport.js│ │    Agents    │ │ Files / Run │  │  RabbitMQ   │
 └─────┬──────┘ └──────┬───────┘ │   Netlify   │  └──────▲──────┘
       │                │         └──────┬──────┘         │
       │                │                │                │
       └────────────────┴────── RabbitMQ ┴────────────────┘
                         │
                    Databases
                         │
                    Netlify API
```

## Repository Structure

| Folder / File       | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `Frontend/`         | React (Vite + Tailwind CSS) app: prompt UI, code editor, preview and deployment flow    |
| `ai-orchestration/` | Multi-agent orchestration service with agents, routes and WebSocket support             |
| `auth/`             | Authentication service with database, Passport.js, controllers and routes               |
| `notification/`     | Notification service consuming events from RabbitMQ                                     |
| `sandbox/`          | Sandbox service handling file operations, previews and Netlify deployment               |
| `k8s/`              | Kubernetes manifests including deployments, services, ingress, RBAC and secret examples |
| `skaffold.yml`      | Skaffold configuration for local Kubernetes development                                 |
| `job-spec.yaml`     | Kubernetes job specification for deployment workflow                                    |

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express

### Realtime Communication

* Socket.IO
* WebSocket (`ws`)

### Authentication

* Passport.js
* OAuth

### Messaging

* RabbitMQ

### AI

* Multi-agent AI orchestration
* AI-powered frontend code generation

### Deployment & Infrastructure

* Docker
* Kubernetes
* Skaffold
* AWS S3
* GitHub Actions
* Netlify

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 18+
* Docker
* kubectl
* A local Kubernetes cluster such as Minikube, Kind, or Docker Desktop Kubernetes
* Skaffold
* RabbitMQ or Docker
* A Netlify account and personal access token

### 1. Clone the Repository

```bash
git clone https://github.com/RinaShewale/NexxAgent.git
cd NexxAgent
```

### 2. Configure Environment Variables

Create a `.env` file inside each required service.

> Never commit real API keys, tokens, passwords or other secrets to GitHub.

#### Auth Service

```env
PORT=<YOUR_AUTH_PORT>
DB_URI=<YOUR_DATABASE_URL>
RABBITMQ_URL=amqp://localhost
SESSION_SECRET=<YOUR_SESSION_SECRET>

GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
```

#### AI Orchestration

```env
PORT=<YOUR_AI_PORT>
AI_API_KEY=<YOUR_AI_API_KEY>
```

#### Sandbox

```env
PORT=<YOUR_SANDBOX_PORT>
NETLIFY_AUTH_TOKEN=<YOUR_NETLIFY_AUTH_TOKEN>
```

#### Notification

```env
RABBITMQ_URL=amqp://localhost
```

For Kubernetes deployment, copy the example secrets file:

```bash
cp k8s/secrets.yml.example k8s/secrets.yml
```

Then configure the required values.

**Do not commit `k8s/secrets.yml` to Git.**

## Running Locally

Each service can be installed and started separately.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Auth Service

```bash
cd auth
npm install
npm start
```

### AI Orchestration Service

```bash
cd ai-orchestration
npm install
npm start
```

### Sandbox Service

```bash
cd sandbox
npm install
npm start
```

### Notification Service

```bash
cd notification
npm install
npm start
```

## Running with Kubernetes

Make sure your local Kubernetes cluster is running.

Apply the Kubernetes secrets:

```bash
kubectl apply -f k8s/secrets.yml
```

Then start the development environment using Skaffold:

```bash
skaffold dev
```

Skaffold will build and deploy the required services to the local Kubernetes cluster.

## How It Works

The overall workflow is:

```text
User Prompt
     │
     ▼
Frontend
     │
     ▼
AI Orchestration
     │
     ▼
Specialized AI Agents
     │
     ▼
Generated Frontend Files
     │
     ▼
Sandbox Service
     │
     ├──────────────► Live Preview
     │
     └──────────────► Socket.IO
                          │
                          ▼
                    Code Editor
                          │
                          ▼
                       Deploy
                          │
                          ▼
                       Netlify
                          │
                          ▼
                    Notification
```

### Step 1: Authentication

The user signs in through the authentication service.

### Step 2: Prompt

The user describes the website or UI they want to create.

### Step 3: AI Orchestration

The AI orchestration service receives the request and distributes the task among specialized agents.

### Step 4: Code Generation

The agents generate the required frontend files and project structure.

### Step 5: Sandbox

The generated project is written into an isolated sandbox environment where it can be executed safely.

### Step 6: Live Editing

Generated files are streamed to the browser editor using Socket.IO.

Users can modify the generated code and immediately see the changes in the preview.

### Step 7: Deployment

When the user is satisfied with the result, the sandbox service deploys the generated website to Netlify.

### Step 8: Notification

The notification service processes deployment-related events through RabbitMQ.

## Microservices

### Auth Service

Responsible for:

* User authentication
* OAuth login
* Session management
* User information
* Authentication-related database operations

### AI Orchestration Service

Responsible for:

* Receiving user prompts
* Managing AI agents
* Generating frontend code
* Coordinating agent workflows
* Communicating with the frontend and sandbox services

### Sandbox Service

Responsible for:

* Creating project files
* Updating generated files
* Running the generated frontend
* Providing preview functionality
* Deploying generated projects to Netlify

### Notification Service

Responsible for:

* Consuming RabbitMQ events
* Processing asynchronous notifications
* Handling deployment-related notification workflows

## Deployment

Each major service contains its own Docker configuration.

Kubernetes manifests are available inside the `k8s/` directory.

The deployment architecture includes:

* Frontend
* AI orchestration
* Authentication
* Sandbox
* Notification
* Router / Ingress
* RabbitMQ
* Database
* AWS S3
* Netlify

Generated user websites are deployed to Netlify through the sandbox service.

## Project Goals

NexxAgent was created to explore how AI-powered development tools can combine:

* Multi-agent systems
* Frontend code generation
* Live code editing
* Sandboxed execution
* Real-time communication
* Containerized services
* Kubernetes orchestration
* Automated deployment

The project is also an opportunity to learn how multiple backend services can communicate and work together as a distributed system.

## Roadmap

* [ ] Add automated tests
* [ ] Improve CI/CD checks
* [ ] Add project history and versioning
* [ ] Support Vercel deployment
* [ ] Support S3 static hosting
* [ ] Improve AI-generated UI quality
* [ ] Add more specialized AI agents
* [ ] Improve error handling and recovery
* [ ] Improve sandbox isolation
* [ ] Add better project management features

## Contributing

Contributions and suggestions are welcome.

To create a feature branch:

```bash
git checkout -b feat/your-feature
```

Commit your changes:

```bash
git add .
git commit -m "feat: describe your change"
```

Push the branch:

```bash
git push origin feat/your-feature
```

Then open a Pull Request.

## Learning Purpose

NexxAgent is a learning and portfolio project built to explore full-stack development, AI-powered code generation, microservices, real-time communication, containerization, Kubernetes and deployment workflows.

The project is continuously evolving as new concepts and technologies are learned and implemented.

## Author

**Rina Shewale**

GitHub: [@RinaShewale](https://github.com/RinaShewale)
