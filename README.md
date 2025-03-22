# Task Management API

A robust RESTful API for managing tasks and subtasks, built with Node.js, Express, TypeScript, and
MongoDB.

# Live Application URL

Application is currently available at https://todo-project-thp9.onrender.com/

Swagger UI: https://todo-project-thp9.onrender.com/api-docs

## ✨ Features

- **Task Management:** Create, read, update, and delete tasks.
- **Subtask Management:** Create, read, update, and delete subtasks.
- **Nested Subtasks:** Support for nested subtasks organization.
- **Multi-Environment:** Development, staging, and production configurations.
- **Data Validation:** Comprehensive input validation and error handling.
- **Swagger UI:** Automatically generated API documentation.

## 📋 Prerequisites

**For Developers (Local Setup):**

1. Node.js (v18.0.0 or higher): [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. MongoDB (v4.4 or
   higher): [https://www.mongodb.com/docs/manual/installation/](https://www.mongodb.com/docs/manual/installation/)
3. npm or
   yarn: [https://docs.npmjs.com/cli/v8/commands/npm-install](https://docs.npmjs.com/cli/v8/commands/npm-install)
4. Docker (Optional, for running MongoDB or docker
   compose): [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

**For End-Users (Docker Compose Setup):**

1. Docker: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

## 🚀 Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone [git@github.com:SanjeevVerma12345/todo-project.git](git@github.com:SanjeevVerma12345/todo-project.git)
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Running the Application

**As a Developer (Local Environment):**

1. **Run in development mode:**

   ```bash
   npm run start:dev
   ```

2. **Run in staging mode:**

   ```bash
   npm run start:staging
   ```

3. **Run in production mode:**

   ```bash
   npm run start:prod
   ```

**As an End-User using Docker Compose for the entire application and MongoDB:**

1. **Navigate to the `docker` directory:**

   ```bash
   cd docker/
   ```

2. **Build the Docker images (with caching):**

   ```bash
   docker compose build --no-cache
   ```

3. **Start the containers in detached mode:**

   ```bash
   docker compose up -d
   ```

   The application will be accessible at `http://localhost:3000`.

### Running Tests

   ```bash
  npm test
   ```

## 🧪 Code Quality

**Linting:**

```bash
    npm run lint      # Check for linting issues
    npm run lint:fix  # Automatically fix linting issues
```

# 📚 Documentation

Swagger UI: The API documentation is automatically generated and accessible via Swagger UI. Once the
application is running, navigate to: http://localhost:3000/api-docs

# 🤝 Support and Questions

For support or questions, please contact Sanjeev Verma at: verma_sanjeev@outlook.com