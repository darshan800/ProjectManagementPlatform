import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { SubTask } from "../models/subtask.models.js";
import { Task } from "../models/task.models.js";
import { ProjectNote } from "../models/note.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

//list the project notes
const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  //1.check whether project exist or not
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(403, "Project does not exist");
  }

  //2. check whether the current user is a part of the project
  const isMember = await ProjectMember.findOne({
    project: projectId,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "you are not part of the project");
  }

  //3. fetch the notes
  const notes = await ProjectNote.find({ project: projectId })
    .populate("createdBy", "username email ")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched succesfully"));
});

//notes creation
const createNotes = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  const allowedUser = ["admin"];

  // allow only admin to create notes
  if (!req.user || !allowedUser.includes(req.user.role)) {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  // check whteher projectId exist or not
  if (!project) {
    throw new ApiError(404, "ProjectId not found");
  }

  //check whether current user is part of the project
  const isMember = await ProjectMember.findOne({
    project: projectId,
    user: req.user._id,
  });
  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }

  // create notes
  const projectNote = await ProjectNote.create({
    content,
    createdBy: req.user._id,
    project: new mongoose.Types.ObjectId(projectId),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, projectNote, "Notes  created succesfully"));
});

//details of the notes
const getNotesById = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  //1.check whether project exist or not
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(403, "project not found");
  }

  //2.check whether the current user i member of the project or not
  const isMember = await ProjectMember.findOne({
    project: projectId,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }

  const note = await ProjectNote.findOne({
    _id: noteId,
    project: projectId,
  }).populate("createdBy", "username, email");

  if (!note) {
    throw new ApiError(404, "Note not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, note, "Notes fetched successfully"));
});

//update the notes
const updateNotes = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const { content } = req.body;

  //1.check whether current user is admin or not
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  //2.validate content
  if (!content?.trim()) {
    throw new ApiError(400, "content is required to update the notes");
  }

  //3.check whether project exist or not
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(403, "project not found");
  }

  //4.check whether the current user i member of the project or not
  const isMember = await ProjectMember.findOne({
    project: projectId,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }
  //5.check noteId and update it
  const note = await ProjectNote.findOne({
    _id: noteId,
    project: projectId,
  });

  if (!note) {
    throw new ApiError(403, "note didn't found");
  }

  note.content = content.trim();
  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(201, note, "notes updated succesfully"));
});

//delete notes
const deleteNotes = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  //1.check whether current user is admin or not
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "You are not allowed to perform this action");
  }

  //3.check whether project exist or not
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "project not found");
  }

  //4.check whether the current user i member of the project or not
  const isMember = await ProjectMember.findOne({
    project: projectId,
    user: req.user._id,
  });

  if (!isMember) {
    throw new ApiError(403, "You are not part of the project");
  }

  const note = await ProjectNote.findOneAndDelete({
    _id: noteId,
    project: projectId, // <-- ties note to project
  });

  if (!note) {
    throw new ApiError(404, "notes didn't found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfulyy"));
});

export { getNotes, createNotes, getNotesById, updateNotes, deleteNotes };
