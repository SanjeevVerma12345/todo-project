import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {TaskService} from "../../src/services/task-service";
import {TaskController} from "../../src/controllers/task-controller";
import {TaskRepository} from "../../src/repositories/task-repository";
import Task, {ITask} from "../../src/models/task";

describe('Task Controller Integration Tests', () => {
  let app: express.Express;
  let mongoServer: MongoMemoryServer;
  let insertedTaskId: string;

  const sampleTask = {
    title: "My title",
    description: "My description",
    completed: false,
    subtasks: [
      {
        title: "sub task title",
        completed: false,
        subtasks: [
          {
            title: "sub-sub task title",
            completed: true
          }
        ]
      }
    ]
  } as ITask;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Set up Express app
    app = express();
    app.use(express.json());

    const taskController = new TaskController(new TaskService(new TaskRepository()));

    // Register routes
    app.get('/api/v1/tasks', taskController.getTasks.bind(taskController));
    app.get('/api/v1/tasks/:id', taskController.getTask.bind(taskController));
    app.post('/api/v1/tasks', taskController.createTask.bind(taskController));
    app.put('/api/v1/tasks/:id', taskController.updateTask.bind(taskController));
    app.delete('/api/v1/tasks/:id', taskController.deleteTask.bind(taskController));

    const task = new Task(sampleTask);
    const savedTask = await task.save();
    insertedTaskId = savedTask._id.toString();
  });

  afterAll(async () => {
    await Task.deleteMany({});
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/v1/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app)
      .get('/api/v1/tasks')
      .expect('Content-Type', /json/)
      .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      const foundTask = response.body.find((task: { _id: string; }) => task._id === insertedTaskId);
      expect(foundTask).toBeDefined();
      expect(foundTask.title).toBe(sampleTask.title);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
      .get(`/api/v1/tasks/1`)
      .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toContain('InvalidIdException: Invalid ID: 1');
    });

    it('should return a specific task by ID', async () => {
      const response = await request(app)
      .get(`/api/v1/tasks/${insertedTaskId}`)
      .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(insertedTaskId);
      expect(response.body.title).toBe(sampleTask.title);
    });

    it('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      await request(app)
      .get(`/api/v1/tasks/${nonExistentId}`)
      .expect(404);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task with the provided data', async () => {
      const newTask = {
        title: "New Task",
        description: "New Description",
        completed: false
      };

      const response = await request(app)
      .post('/api/v1/tasks')
      .send(newTask)
      .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);

      // Verify task was actually saved to database
      const savedTask = await Task.findById(response.body._id);
      expect(savedTask).toBeDefined();
      expect(savedTask!.title).toBe(newTask.title);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
      .put(`/api/v1/tasks/1`)
      .send({title: "Updated Title"})
      .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toContain('InvalidIdException: Invalid ID: 1');
    });

    it('should update an existing task', async () => {
      const updateData = {
        title: "Updated Title",
        completed: true
      };

      const response = await request(app)
      .put(`/api/v1/tasks/${insertedTaskId}`)
      .send(updateData)
      .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(insertedTaskId);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.completed).toBe(updateData.completed);

      // Verify task was actually updated in database
      const updatedTask = await Task.findById(insertedTaskId);
      expect(updatedTask).toBeDefined();
      expect(updatedTask!.title).toBe(updateData.title);
      expect(updatedTask!.completed).toBe(updateData.completed);
    });

    it('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      await request(app)
      .put(`/api/v1/tasks/${nonExistentId}`)
      .send({title: "Updated Title"})
      .expect(404);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should return 400 for invalid task ID', async () => {
      const response = await request(app)
      .delete(`/api/v1/tasks/1`)
      .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toContain('InvalidIdException: Invalid ID: 1');
    });

    it('should delete a task if exists', async () => {
      // First create a task to delete
      const taskToDelete = new Task({
        title: "Task to Delete",
        description: "This task will be deleted",
        completed: false
      });
      const savedTask = await taskToDelete.save();
      const taskIdToDelete = savedTask._id.toString();

      // Delete the task
      await request(app)
      .delete(`/api/v1/tasks/${taskIdToDelete}`)
      .expect(204);

      // Verify
      const deletedTask = await Task.findById(taskIdToDelete);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      await request(app)
      .delete(`/api/v1/tasks/${nonExistentId}`)
      .expect(404);
    });

    it('should return 404 if deleted twice', async () => {
      const taskToDelete = new Task({
        title: "Task to Delete",
        description: "This task will be deleted",
        completed: false
      });
      const savedTask = await taskToDelete.save();
      const taskIdToDelete = savedTask._id.toString();

      await request(app)
      .delete(`/api/v1/tasks/${taskIdToDelete}`)
      .expect(204);

      await request(app)
      .delete(`/api/v1/tasks/${taskIdToDelete}`)
      .expect(404);
    });
  });
});