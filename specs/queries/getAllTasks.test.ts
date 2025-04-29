import taskModel from "@/graphql/models/task.model";
import type { TaskDocument } from "@/graphql/models/task.model";
import { getAllTasks } from "@/graphql/resolvers/queries/getAllTasks";

jest.mock("@/graphql/models/task.model", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

describe("getAllTasks Query", () => {
  const mockTask: Partial<TaskDocument> = {
    _id: "abc123" as any,
    taskName: "Test Task",
    description: "This is a valid description",
    isDone: false,
    priority: 3,
    tags: ["test"],
    userId: "user123",
  };

  const args = { userId: "user123" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all tasks successfully", async () => {
    (taskModel.find as jest.Mock).mockResolvedValue([mockTask]);

    const result = await getAllTasks({}, args);

    expect(result).toStrictEqual([mockTask]);
    expect(taskModel.find).toHaveBeenCalled();
  });

  it("should throw error if no tasks found", async () => {
    (taskModel.find as jest.Mock).mockResolvedValue([]);

    await expect(getAllTasks({}, args)).rejects.toThrow(
      "You don't have any tasks yet"
    );

    expect(taskModel.find).toHaveBeenCalled();
  });
});
