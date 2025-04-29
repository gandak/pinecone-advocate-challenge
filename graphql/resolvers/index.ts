import { addTask } from "./mutations/addTask";
import { updateTask } from "./mutations/updateTask";
import { getAllTasks } from "./queries/getAllTasks";
import { getFinishedTasksLists } from "./queries/getFinishedTasksLists";

export const resolvers = {
  Mutation: {
    addTask,
    updateTask,
  },
  Query: {
    getAllTasks,
    getFinishedTasksLists,
  },
};
