import taskModel from "@/graphql/models/task.model";

export const getFinishedTasksLists = async (
  _: any,
  args: { userId: string }
) => {
  const { userId } = args;

  const user = await taskModel.find({ userId });
  if (!user) {
    throw new Error("User not found");
  }

  const doneTask = await taskModel.find({ userId, isDone: true });
  return doneTask;
};

export const getUserNotDoneTasksLists = {
  Query: {
    getFinishedTasksLists,
  },
};
