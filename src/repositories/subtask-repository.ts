import {ISubtask} from "../models/subtask";
import Task from "../models/task";
import mongoose, {Types} from "mongoose";
import {ISubtaskRepository} from "../interfaces/subtask-repository-interface";

export class SubtaskRepository implements ISubtaskRepository {

  /**
   * Updates an existing subtask
   */
  async updateSubtask(taskId: string, subtaskId: string, subtask: Partial<ISubtask>): Promise<ISubtask | null> {
    const task = await Task.findOne({_id: taskId});
    if (!task) return null;

    const index = task.subtasks.findIndex(st => st._id.toString() === subtaskId);
    if (index === -1) return null;

    const existing = task.subtasks[index];
    const updatedSubtask = {
      ...existing.toObject(),
      ...subtask,
      _id: existing._id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      subtasks: subtask.subtasks?.map(n => {
        const e = existing.subtasks?.find(s => s._id?.toString() === n._id?.toString());
        return e ?
            {...e.toObject(), ...n, _id: e._id, createdAt: e.createdAt, updatedAt: new Date()} :
            {
              ...n,
              _id: n._id || new mongoose.Types.ObjectId(),
              createdAt: new Date(),
              updatedAt: new Date()
            };
      }) || []
    };

    const updatedTask = await Task.findOneAndUpdate(
        {_id: taskId},
        {$set: {[`subtasks.${index}`]: updatedSubtask}},
        {new: true}
    );

    return updatedTask?.subtasks[index] || null;
  }

  /**
   * Deletes a subtask from a task
   */
  async deleteSubtask(taskId: string, subtaskId: string): Promise<boolean> {
    const result = await Task.findByIdAndUpdate(
        taskId,
        {$pull: {subtasks: {_id: subtaskId}}},
        {new: true}
    );
    return result !== null;
  }

  /**
   * Gets a subtask by its ID
   */
  async getSubtask(taskId: string, subtaskId: string): Promise<ISubtask | null> {
    const task = await Task.findOne(
        {_id: taskId, 'subtasks._id': subtaskId},
        {'subtasks.$': 1}
    );

    if (!task || !task.subtasks || task.subtasks.length === 0) {
      return null;
    }

    return task.subtasks[0];
  }

  /**
   * Creates a new subtask
   */
  async createSubtask(taskId: string, subtask: Partial<ISubtask>): Promise<ISubtask | null> {
    const newSubtask = {_id: new Types.ObjectId(), ...subtask} as ISubtask;

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {$push: {subtasks: newSubtask}},
        {new: true}
    );

    if (!updatedTask) {
      return null;
    }

    return updatedTask.subtasks.find(
        s => s._id.toString() === newSubtask._id.toString()
    ) || null;
  }
}