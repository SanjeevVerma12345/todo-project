// Create a new database and switch to it
db = db.getSiblingDB('todo-app');

// Function to create UTC dates
function utcNow() {
  return new Date(Date.now());
}

// Create collections
db.createCollection('tasks');

// Insert initial tasks with nested subtasks
const task1 = {
  _id: ObjectId(),
  title: "Build Todo Application",
  description: "Create a full-stack todo application with nested subtasks",
  completed: false,
  subtasks: [
    {
      _id: ObjectId(),
      title: "Setup Backend",
      description: "Create the Node.js backend with Express",
      completed: true,
      subtasks: [
        {
          _id: ObjectId(),
          title: "Initialize project",
          description: "Create package.json and install dependencies",
          completed: true,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Configure TypeScript",
          description: "Set up tsconfig.json and types",
          completed: true,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Setup MongoDB connection",
          description: "Configure database connection and models",
          completed: true,
          subtasks: [
            {
              _id: ObjectId(),
              title: "Create database models",
              description: "Define Task and Subtask schemas",
              completed: true,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            },
            {
              _id: ObjectId(),
              title: "Setup connection string",
              description: "Configure MongoDB URI and connection options",
              completed: true,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            }
          ],
          createdAt: utcNow(),
          updatedAt: utcNow()
        }
      ],
      createdAt: utcNow(),
      updatedAt: utcNow()
    },
    {
      _id: ObjectId(),
      title: "Create Frontend",
      description: "Build the React frontend application",
      completed: false,
      subtasks: [
        {
          _id: ObjectId(),
          title: "Setup React project",
          description: "Initialize React with TypeScript",
          completed: true,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Create components",
          description: "Build reusable UI components",
          completed: false,
          subtasks: [
            {
              _id: ObjectId(),
              title: "Task component",
              description: "Component to display a task",
              completed: true,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            },
            {
              _id: ObjectId(),
              title: "Subtask component",
              description: "Component to display subtasks recursively",
              completed: false,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            }
          ],
          createdAt: utcNow(),
          updatedAt: utcNow()
        }
      ],
      createdAt: utcNow(),
      updatedAt: utcNow()
    }
  ],
  createdAt: utcNow(),
  updatedAt: utcNow()
};

const task2 = {
  _id: ObjectId(),
  title: "Write Documentation",
  description: "Create comprehensive documentation for the project",
  completed: false,
  subtasks: [
    {
      _id: ObjectId(),
      title: "API Documentation",
      description: "Document all API endpoints",
      completed: false,
      subtasks: [
        {
          _id: ObjectId(),
          title: "Task endpoints",
          description: "Document CRUD operations for tasks",
          completed: false,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Subtask endpoints",
          description: "Document CRUD operations for subtasks",
          completed: false,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        }
      ],
      createdAt: utcNow(),
      updatedAt: utcNow()
    },
    {
      _id: ObjectId(),
      title: "User Guide",
      description: "Create user documentation",
      completed: false,
      subtasks: [
        {
          _id: ObjectId(),
          title: "Installation guide",
          description: "How to install and run the application",
          completed: true,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Usage examples",
          description: "Provide examples of how to use the application",
          completed: false,
          subtasks: [
            {
              _id: ObjectId(),
              title: "Basic usage",
              description: "Simple examples for beginners",
              completed: false,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            },
            {
              _id: ObjectId(),
              title: "Advanced features",
              description: "Examples of advanced functionality",
              completed: false,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            }
          ],
          createdAt: utcNow(),
          updatedAt: utcNow()
        }
      ],
      createdAt: utcNow(),
      updatedAt: utcNow()
    }
  ],
  createdAt: utcNow(),
  updatedAt: utcNow()
};

const task3 = {
  _id: ObjectId(),
  title: "Deploy Application",
  description: "Deploy the application to production",
  completed: false,
  subtasks: [
    {
      _id: ObjectId(),
      title: "Setup CI/CD",
      description: "Configure continuous integration and deployment",
      completed: false,
      subtasks: [
        {
          _id: ObjectId(),
          title: "Configure GitHub Actions",
          description: "Set up automated testing and deployment",
          completed: false,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Setup deployment pipeline",
          description: "Configure deployment to cloud provider",
          completed: false,
          subtasks: [
            {
              _id: ObjectId(),
              title: "Configure staging environment",
              description: "Set up staging deployment",
              completed: false,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            },
            {
              _id: ObjectId(),
              title: "Configure production environment",
              description: "Set up production deployment",
              completed: false,
              subtasks: [],
              createdAt: utcNow(),
              updatedAt: utcNow()
            }
          ],
          createdAt: utcNow(),
          updatedAt: utcNow()
        }
      ],
      createdAt: utcNow(),
      updatedAt: utcNow()
    },
    {
      _id: ObjectId(),
      title: "Configure Database",
      description: "Set up production database",
      completed: false,
      subtasks: [
        {
          _id: ObjectId(),
          title: "Create MongoDB Atlas cluster",
          description: "Set up cloud MongoDB instance",
          completed: false,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        },
        {
          _id: ObjectId(),
          title: "Configure backups",
          description: "Set up automated database backups",
          completed: false,
          subtasks: [],
          createdAt: utcNow(),
          updatedAt: utcNow()
        }
      ],
      createdAt: utcNow(),
      updatedAt: utcNow()
    }
  ],
  createdAt: utcNow(),
  updatedAt: utcNow()
};

// Insert tasks
db.tasks.insertMany([task1, task2, task3]);

// Create indexes for better query performance
db.tasks.createIndex({"title": 1});
db.tasks.createIndex({"title": "text", "description": "text"});

print('Database initialization completed with tasks and nested subtasks');