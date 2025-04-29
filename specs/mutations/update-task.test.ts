import taskModel from "@/graphql/models/task.model";
import type { TaskDocument } from "@/graphql/models/task.model";
import { updateTask } from "@/graphql/resolvers/mutations/updateTask";

jest.mock("@/graphql/models/task.model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("updateTask Mutation", () => {
  const mockTask: Partial<TaskDocument> = {
    _id: "abc123" as any,
    taskName: "Test Task",
    description: "This is a valid description",
    isDone: false,
    priority: 3,
    tags: ["test"],
    userId: "user123",
  };

  const updateArgs = {
    _id: "abc123",
    taskName: "Updated Task Name",
    description: "Updated description",
    isDone: false,
    priority: 2,
    tags: ["test"],
    userId: "user123",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update task successfully", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue(mockTask);

    const updatedMockTask = {
      ...mockTask,
      taskName: "Updated Task Name",
      priority: 2,
      description: "Updated description",
    };

    (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      updatedMockTask
    );

    const result = await updateTask({}, updateArgs);

    expect(result.taskName).toBe("Updated Task Name");
    expect(result.priority).toBe(2);
    expect(result.description).toBe("Updated description");
    expect(result.isDone).toBe(false);

    expect(taskModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("should throw error if task not found", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateTask({}, updateArgs)).rejects.toThrow("Task not found");

    expect(taskModel.findById).toHaveBeenCalledWith("abc123");
    expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw error if user is not authorized ", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue({
      ...mockTask,
      userId: "user567",
    });

    await expect(updateTask({}, updateArgs)).rejects.toThrow(
      "You are not authorized to update this task."
    );

    expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw error if priority is out of range", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue(mockTask);

    await expect(
      updateTask({}, { ...updateArgs, priority: 6 })
    ).rejects.toThrow("Priority must be between 1 and 5.");

    expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw error if task name and description are same", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue(mockTask);

    const sameNameArgs = {
      _id: "abc123",
      userId: "user123",
      taskName: "Task Name",
      description: "Task Name",
      isDone: false,
      priority: 3,
      tags: ["test"],
    };

    await expect(updateTask({}, sameNameArgs)).rejects.toThrow(
      "Description and task name must be different."
    );

    expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw error if tags are more than 5", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue(mockTask);

    await expect(
      updateTask(
        {},
        {
          ...updateArgs,
          tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
        }
      )
    ).rejects.toThrow("You can have at most 5 tags.");

    expect(taskModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw error if task not updated", async () => {
    (taskModel.findById as jest.Mock).mockResolvedValue(mockTask);
    (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateTask({}, updateArgs)).rejects.toThrow(
      "Task update failed."
    );

    expect(taskModel.findById).toHaveBeenCalledWith("abc123");
    expect(taskModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});
