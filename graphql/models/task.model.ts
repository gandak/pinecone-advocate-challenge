import mongoose, { Document, Schema } from "mongoose";

export type TaskSchemaType = {
  taskName: string;
  description: string;
  isDone: boolean;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type TaskDocument = TaskSchemaType & Document;

const TaskSchema = new Schema<TaskDocument>({
  taskName: { type: String, required: true },
  description: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  priority: { type: Number, required: true },
  tags: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

TaskSchema.index({ userId: 1, taskName: 1 }, { unique: true });

const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema);
export default TaskModel;
