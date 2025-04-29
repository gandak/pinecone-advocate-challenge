import { addTask } from "@/graphql/resolvers/mutations/addTask";
import taskModel from "@/graphql/models/task.model";
import type { TaskDocument } from "@/graphql/models/task.model";

jest.mock("@/graphql/models/task.model", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("addTask Mutation", () => {
  const mockTask: Partial<TaskDocument> = {
    _id: "abc123" as any,
    taskName: "Test Task",
    description: "This is a valid description",
    isDone: false,
    priority: 3,
    tags: ["test"],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user123",
  };

  const baseArgs = {
    taskName: "Test Task Long Name",
    description: "This is a valid description",
    priority: 3,
    tags: ["test"],
    userId: "user123",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add task successfully", async () => {
    (taskModel.findOne as jest.Mock).mockResolvedValue(null);
    (taskModel.create as jest.Mock).mockResolvedValue(mockTask);

    const result = await addTask({}, baseArgs);

    expect(result.taskName).toBe("Test Task");
    expect(result.isDone).toBe(false);

    expect(taskModel.create).toHaveBeenCalled();
  });

  it("should throw error if description is too short", async () => {
    const args = {
      ...baseArgs,
      description: "Short",
    };

    await expect(addTask({}, args)).rejects.toThrow(
      "Description must be at least 10 characters long."
    );
    expect(taskModel.create).not.toHaveBeenCalled();
  });

  it("should throw error if description is same as task name", async () => {
    const args = {
      ...baseArgs,
      description: baseArgs.taskName,
    };

    await expect(addTask({}, args)).rejects.toThrow(
      "Description and task name must be different."
    );
    expect(taskModel.create).not.toHaveBeenCalled();
  });

  it("should throw error if too many tags", async () => {
    const args = {
      ...baseArgs,
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
    };

    await expect(addTask({}, args)).rejects.toThrow(
      "Tags can not be more than 5"
    );
    expect(taskModel.create).not.toHaveBeenCalled();
  });

  it("should throw error if task already exists", async () => {
    (taskModel.findOne as jest.Mock).mockResolvedValue(mockTask);

    await expect(addTask({}, baseArgs)).rejects.toThrow("Task already exists.");
    expect(taskModel.create).not.toHaveBeenCalled();
  });

  it("should throw error if priority is out of range", async () => {
    let args = {
      ...baseArgs,
      priority: 0,
    };

    await expect(addTask({}, args)).rejects.toThrow(
      "Priority must be between 1 and 5."
    );
    expect(taskModel.create).not.toHaveBeenCalled();

    args = {
      ...baseArgs,
      priority: 6,
    };

    await expect(addTask({}, args)).rejects.toThrow(
      "Priority must be between 1 and 5."
    );
    expect(taskModel.create).not.toHaveBeenCalled();
  });
});
