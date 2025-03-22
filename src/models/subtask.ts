import {Document, Schema, Types} from "mongoose";

export interface ISubtask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  subtasks?: Types.DocumentArray<ISubtask>;
  createdAt: Date;
  updatedAt: Date;
}

export const SubtaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'SubTask title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    validate: {
      validator: (value: string) => value.length > 0,
      message: 'Title cannot be empty'
    }
  },
  description: {
    type: String,
    default: null,
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
  createdAt: {
    type: Date,
    immutable: true
  },
  subtasks: {
    type: [/* Will be populated after schema creation */],
    default: [],
  }
}, {
  timestamps: {
    currentTime: () => new Date(Date.now())
  },
  versionKey: false
});


SubtaskSchema.add({subtasks: [SubtaskSchema]});
SubtaskSchema.index({title: 1});
