import taskModel from "@/graphql/models/task.model";
import { GraphQLError } from "graphql";

export const getAllTasks = async (
  _: any,
  args: {
    userId: string;
  }
) => {
  const { userId } = args;

  const tasks = await taskModel.find({ userId });

  if (tasks.length === 0) {
    throw new GraphQLError("You don't have any tasks yet");
  }

  return tasks;
};
