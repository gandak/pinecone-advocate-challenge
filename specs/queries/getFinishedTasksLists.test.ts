import taskModel from "@/graphql/models/task.model";
import type { TaskDocument } from "@/graphql/models/task.model";
import { getFinishedTasksLists } from "@/graphql/resolvers/queries/getFinishedTasksLists";

jest.mock("@/graphql/models/task.model", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

describe("getFinishedTasksLists Query", () => {
  const mockTask: Partial<TaskDocument> = {
    _id: "abc123" as any,
    taskName: "Test Task",
    description: "This is a valid description",
    isDone: true,
    priority: 3,
    tags: ["test"],
    userId: "user123",
  };

  const args = { userId: "user123" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all finished tasks successfully", async () => {
    (taskModel.find as jest.Mock).mockResolvedValue([mockTask]);

    const result = await getFinishedTasksLists({}, args);

    expect(result).toStrictEqual([mockTask]);
    expect(taskModel.find).toHaveBeenCalled();
  });

  it("should throw error if no finished tasks found", async () => {
    (taskModel.find as jest.Mock).mockResolvedValue([]);

    await expect(getFinishedTasksLists({}, args)).rejects.toThrow(
      "You don't have any finished tasks yet"
    );

    expect(taskModel.find).toHaveBeenCalled();
  });
});
