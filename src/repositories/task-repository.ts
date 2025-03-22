import {TaskRepositoryInterface} from '../interfaces/task-repository-interface';
import Task, {ITask} from "../models/task";

export class TaskRepository implements TaskRepositoryInterface {

  async findAll(): Promise<ITask[]> {
    return await Task.find().exec();
  }

  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    return await Task.findByIdAndDelete(id).exec() !== null;
  }

  async create(task: Partial<ITask>): Promise<ITask> {
    return await Task.create(task);
  }

  async update(id: string, task: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, task, {
      new: true,
      runValidators: true
    }).exec();
  }

}