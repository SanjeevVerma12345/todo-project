import request from 'supertest';
import express from 'express';
import {SubtaskController} from "../../src/controllers/subtask-controller";
import {SubtaskService} from "../../src/services/subtask-service";
import {ISubtaskRepository} from "../../src/interfaces/subtask-repository-interface";
import {ISubtask} from "../../src/models/subtask";
import mongoose, {Types} from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {SubtaskRepository} from '../../src/repositories/subtask-repository';
import Task, {ITask} from "../../src/models/task";

describe('Subtask Controller Integration Test', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  let subtaskRepository: ISubtaskRepository;
  let connection: mongoose.Mongoose;

  const mockSubtask = {
    _id: new Types.ObjectId(),
    title: 'Test Subtask',
    description: 'This is a test subtask',
    completed: false,
  } as ISubtask;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    connection = await mongoose.connect(mongoServer.getUri());
    subtaskRepository = new SubtaskRepository();
  });

  afterAll(async () => {
    await connection.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const subtaskController = new SubtaskController(new SubtaskService(subtaskRepository));

    app.get('/tasks/:id/subtasks/:subtaskId', subtaskController.getSubTask.bind(subtaskController));
    app.delete('/tasks/:id/subtasks/:subtaskId', subtaskController.deleteSubTask.bind(subtaskController));
    app.post('/tasks/:id/subtasks', subtaskController.createSubTask.bind(subtaskController));
    app.put('/tasks/:id/subtasks/:subtaskId', subtaskController.updateSubTaskById.bind(subtaskController));
  });

  describe('GET /tasks/:id/subtasks/:subtaskId', () => {

    it('should return 400 for invalid task and subtask ID', async () => {
      const response = await request(app)
      .get('/tasks/task123/subtasks/subtask456')
      .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toContain('InvalidIdException: Invalid ID: task123');
    });

    it('should return 404 for non-existent subtask ID', async () => {
      await request(app)
      .get(`/tasks/${new Types.ObjectId()}/subtasks/${new Types.ObjectId()}`)
      .expect(404);
    });

    it('should return a subtask when it exists', async () => {
      const task = new Task({
        title: "My Task",
        description: "My Task Description",
        completed: false,
        subtasks: [{
          _id: mockSubtask._id,
          title: mockSubtask.title,
          description: mockSubtask.description,
          completed: mockSubtask.completed,
          subtasks: []
        }]
      }) as ITask;
      const savedTask = await task.save();
      await subtaskRepository.createSubtask(savedTask._id.toString(), mockSubtask);

      const response = await request(app)
      .get(`/tasks/${savedTask._id.toString()}/subtasks/${mockSubtask._id}`)
      .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body._id).toEqual(mockSubtask._id.toString());
      expect(response.body.title).toEqual(mockSubtask.title);
      expect(response.body.description).toEqual(mockSubtask.description);
      expect(response.body.completed).toEqual(mockSubtask.completed);
      expect(response.body.subtasks).toEqual([]);
    });
  });

  describe('DELETE /tasks/:id/subtasks/:subtaskId', () => {

    it('should return 400 for invalid subtask ID', async () => {
      const response = await request(app)
      .delete('/tasks/507f1f77bcf86cd799439011/subtasks/subtask456')
      .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toContain('InvalidIdException: Invalid ID: subtask456');
    });

    it('should not delete an non-existing subtask', async () => {
      await request(app)
      .delete(`/tasks/${new Types.ObjectId()}/subtasks/${new Types.ObjectId()}`)
      .expect(404);
    });

    it('should delete a subtask and return 204', async () => {
      const task = new Task({
        title: "Task to Delete",
        description: "My Task Description",
        completed: false,
        subtasks: [{
          _id: mockSubtask._id,
          title: mockSubtask.title,
          description: mockSubtask.description,
          completed: mockSubtask.completed,
          subtasks: []
        }]
      }) as ITask;
      const savedTask = await task.save();
      await subtaskRepository.createSubtask(savedTask._id.toString(), mockSubtask);

      await request(app)
      .delete(`/tasks/${savedTask._id.toString()}/subtasks/${mockSubtask._id}`)
      .expect(204);
    });

    it('should return 404 if deleted called twice', async () => {
      const task = new Task({
        title: "My Task",
        description: "My Task Description",
        completed: false,
        subtasks: [{
          _id: mockSubtask._id,
          title: mockSubtask.title,
          description: mockSubtask.description,
          completed: mockSubtask.completed,
          subtasks: []
        }]
      }) as ITask;
      const savedTask = await task.save();
      await subtaskRepository.createSubtask(savedTask._id.toString(), mockSubtask);

      await request(app)
      .delete(`/tasks/${savedTask._id.toString()}/subtasks/${mockSubtask._id}`)
      .expect(204);

      await request(app)
      .delete(`/tasks/${savedTask._id.toString()}/subtasks/${mockSubtask._id}`)
      .expect(404);
    });
  });

  describe('POST /tasks/:id/subtasks', () => {
    it('should create a new subtask and return 201', async () => {
      const task = new Task({
        title: "My Task",
        description: "My Task Description",
        completed: false,
        subtasks: [{
          _id: mockSubtask._id,
          title: mockSubtask.title,
          description: mockSubtask.description,
          completed: mockSubtask.completed,
          subtasks: []
        }]
      }) as ITask;
      const savedTask = await task.save();

      const subtaskRequest = {
        title: mockSubtask.title,
        description: mockSubtask.description,
        completed: mockSubtask.completed,
      };

      const response = await request(app)
      .post(`/tasks/${savedTask._id.toString()}/subtasks`)
      .send(subtaskRequest)
      .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toEqual(mockSubtask.title);
      expect(response.body.description).toEqual(mockSubtask.description);
      expect(response.body.completed).toEqual(mockSubtask.completed);
      expect(response.body.createdAt).not.toBeNull();
      expect(response.body.updatedAt).not.toBeNull();
      expect(response.body._id).not.toBeNull();
      expect(response.body.subtasks).toEqual([]);
    });

    it('should not save task if database error', async () => {
      await mongoose.disconnect();
      const subtaskRequest = {
        title: mockSubtask.title,
        description: mockSubtask.description,
        completed: mockSubtask.completed,
      };

      await request(app)
      .post(`/tasks/${new Types.ObjectId()}/subtasks`)
      .send(subtaskRequest)
      .expect(500);

      const mongoUri = mongoServer.getUri();
      connection = await mongoose.connect(mongoUri);
    });
  });

  describe('PUT /tasks/:id/subtasks/:subtaskId', () => {

    it('should return 400 for invalid subtask ID', async () => {
      const response = await request(app)
      .put('/tasks/507f1f77bcf86cd799439011/subtasks/subTask')
      .expect(400);

      expect(response.text).toBeDefined();
      expect(response.text).toContain('InvalidIdException: Invalid ID: subTask');
    });

    it('should return 404 for non-existent subtask ID', async () => {
      await request(app)
      .put(`/tasks/${new Types.ObjectId()}/subtasks/${new Types.ObjectId()}`)
      .expect(404);
    });

    it('should update an existing subtask', async () => {
      const task = new Task({
        title: "My Task",
        description: "My Task Description",
        completed: false,
        subtasks: [{
          _id: mockSubtask._id,
          title: mockSubtask.title,
          description: mockSubtask.description,
          completed: mockSubtask.completed,
          subtasks: []
        }]
      }) as ITask;
      const savedTask = await task.save();
      const subtaskRequest = {
        title: 'New Title',
        description: 'New Description',
        completed: true,
      };

      const response = await request(app)
      .put(`/tasks/${savedTask._id.toString()}/subtasks/${mockSubtask._id}`)
      .send(subtaskRequest)
      .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.title).toEqual(subtaskRequest.title);
      expect(response.body.description).toEqual(subtaskRequest.description);
      expect(response.body.completed).toEqual(subtaskRequest.completed);
      expect(response.body.createdAt).not.toBeNull();
      expect(response.body.updatedAt).not.toBeNull();
      expect(response.body._id).not.toBeNull();
      expect(response.body.subtasks).toEqual([]);
    });
  });
});