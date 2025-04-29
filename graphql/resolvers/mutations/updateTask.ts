import taskModel from "@/graphql/models/task.model";
import { GraphQLError } from "graphql";

export const updateTask = async (
  _: any,
  args: {
    _id: string;
    userId: string;
    taskName: string;
    isDone: boolean;
    description: string;
    priority: number;
    tags: string[];
  }
) => {
  const { taskName, userId, priority, isDone, tags, _id, description } = args;

  const task = await taskModel.findById(_id);
  if (!task) {
    throw new GraphQLError("Task not found");
  }

  if (task.userId !== userId) {
    throw new GraphQLError("You are not authorized to update this task.");
  }

  if (priority < 1 || priority > 5) {
    throw new GraphQLError("Priority must be between 1 and 5.");
  }

  if (taskName === description) {
    throw new GraphQLError("Description and task name must be different.");
  }

  if (tags && tags.length > 5) {
    throw new GraphQLError("You can have at most 5 tags.");
  }

  const updatedTask = await taskModel.findByIdAndUpdate(
    _id,
    {
      taskName,
      description: args.description,
      priority,
      isDone,
      tags,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new GraphQLError("Task update failed.");
  }
  return updatedTask;
};
