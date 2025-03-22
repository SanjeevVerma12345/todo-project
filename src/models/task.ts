import {Document, model, Schema, Types} from 'mongoose';
import {ISubtask, SubtaskSchema} from "./subtask";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  subtasks: ISubtask[];
  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    validate: {
      validator: (value: string) => value.length > 0,
      message: 'Title cannot be empty'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    set: (value: string) => value === '' ? undefined : value,
    validate: {
      validator: function (value: string) {
        return value === undefined || value === null || value.length > 0;
      },
      message: 'Description cannot be empty'
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  subtasks: {
    type: [SubtaskSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: {
    currentTime: () => new Date(Date.now())
  },
  versionKey: false
});

TaskSchema.pre('save', function (next) {
  if (this.subtasks && this.subtasks.length === 0) {
    this.subtasks = [];
  }
  next();
});

TaskSchema.index({title: 1});
TaskSchema.index({title: 'text', description: 'text'});

export const TaskModel = model<ITask>('Task', TaskSchema);
export default TaskModel;