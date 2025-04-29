import { GraphQLError } from "graphql";
import taskModel from "@/graphql/models/task.model";

export const addTask = async (
  _: any,
  args: {
    taskName: string;
    description: string;
    priority: number;
    tags: string[];
    userId: string;
  }
) => {
  const { taskName, description, priority, tags, userId } = args;
  const task = await taskModel.findOne({ userId, taskName });

  if (description.length < 10) {
    throw new GraphQLError("Description must be at least 10 characters long.");
  }

  if (taskName === description) {
    throw new GraphQLError("Description and task name must be different.");
  }

  if (tags.length > 5) {
    throw new GraphQLError("Tags can not be more than 5");
  }

  if (priority < 1 || priority > 5) {
    throw new GraphQLError("Priority must be between 1 and 5.");
  }

  const existingTask = await taskModel.findOne({ userId, taskName });
  if (existingTask) {
    throw new GraphQLError("Task already exists.");
  }

  const newTask = await taskModel.create({
    taskName,
    description,
    priority,
    tags,
    userId,
    isDone: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return newTask;
};
