import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { SubTask } from "../models/subtask.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

//list the tasks
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId }).populate(
    "assignedTo",
    "avatar username fullname",
  );

  if (!tasks) {
    throw new ApiError(404, "Task does not found ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "task fetched succesfully"));
});

// create the task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, assignedTo } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created succesfully"));
});

//get the tasks by id
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);
  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

//update the tasks
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { project, assignedBy, assignedTo, status, attachments } = req.body;
  const allowedStatus = ["todo", "in_progress", "done"];

  const allowedUser = ["admin", "project_admin"];
  if (!req.user || !allowedUser.includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized to perform this action");
  }

  if (status && !allowedStatus.includes(status)) {
    throw new ApiError(400, "Inavlid status");
  }

  const updatefeilds = {};

  if (project) updatefeilds.project = project;
  if (assignedBy) updatefeilds.assignedBy = assignedBy;
  if (assignedTo) updatefeilds.assignedTo = assignedTo;
  if (status) updatefeilds.status = status;
  if (attachments) updatefeilds.attachments = attachments;

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: updatefeilds,
    },
    {
      new: true,
    },
  );

  if (!task) throw new ApiError(404, "Task does not exist");

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated succesfully"));
});

//delete the tasks
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // only admins and project_admins role can delete
  const allowedUser = ["admin", "project_admin"];
  if (!req.user || !allowedUser.includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized to perform this action");
  }

  //check whether taskId exist or not
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "task not found");
  }

  //only user of that project can delete
  const isMember = await ProjectMember.findOne({
    project: task.project,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a part of this project");
  }

  await Task.findByIdAndDelete(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

//create sub task
const createSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;
  const task = await Task.findById(taskId);

  //only admin or project admin can create subtask
  const allowedUser = ["admin", "project_admin"];
  if (!req.user || !allowedUser.includes(req.user.role)) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  if (!task) {
    throw new ApiError(404, "Task does not found");
  }

  //check whether the user is part of project or not
  const isMember = await ProjectMember.findOne({
    project: task.project,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }

  //creation
  const subtask = await SubTask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: req.user._id,
    isCompleted: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "subtask is created successfully"));
});

//update the subtask
const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  if (!req.user) {
    throw new ApiError(403, "Unauthorized");
  }

  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new ApiError(400, "Invalid subtask ID");
  }

  const subtask = await SubTask.findById(subTaskId);
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findById(subtask.task);
  if (!task) {
    throw new ApiError(404, "Parent task not found");
  }

  // membership check
  const isMember = await ProjectMember.findOne({
    project: task.project,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }

  // ✅ update completion (allowed for all members)
  if (isCompleted !== undefined) {
    subtask.isCompleted = isCompleted;
  }

  // ✅ update title (restricted)
  if (title) {
    if (!["admin", "project_admin"].includes(req.user.role)) {
      throw new ApiError(403, "Not allowed to update title");
    }

    if (title.trim() === "") {
      throw new ApiError(400, "Title cannot be empty");
    }

    subtask.title = title;
  }

  await subtask.save();

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

//delete the subtask
const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const allowedUser = ["admin", "project_admin"];

  const subtask = await SubTask.findById(subTaskId);
  if (!subtask) {
    throw new ApiError(404, "subtask does not exist");
  }

  if (!req.user || !allowedUser.includes(req.user.role)) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  const task = await Task.findById(subtask.task);
  if (!task) {
    throw new ApiError(404, "parent task not found");
  }
  //check whether the user is part of project or not
  const isMember = await ProjectMember.findOne({
    project: task.project,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }
  await SubTask.findByIdAndDelete(subTaskId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
});

export {
  createSubTask,
  createTask,
  updateSubTask,
  updateTask,
  deleteSubTask,
  deleteTask,
  getTasks,
  getTaskById,
};

k