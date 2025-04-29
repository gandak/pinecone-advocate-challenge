import taskModel from "@/graphql/models/task.model";
import { GraphQLError } from "graphql";

export const getFinishedTasksLists = async (
  _: any,
  args: { userId: string }
) => {
  const { userId } = args;

  const doneTask = await taskModel.find({ userId, isDone: true });

  if (doneTask.length === 0) {
    throw new GraphQLError("You don't have any finished tasks yet");
  }

  return doneTask;
};
