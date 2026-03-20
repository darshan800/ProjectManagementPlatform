import { Router } from "express";

import {createSubTask,
  createTask,
  updateSubTask,
  updateTask,
  deleteSubTask,
  deleteTask,
  getTasks,
  getTaskById,} from "../controllers/task.controller.js"

import { validate } from "../middlewares/validator.middleware.js";

