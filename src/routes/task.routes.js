import { Router } from "express";

import {
  createSubTask,
  createTask,
  updateSubTask,
  updateTask,
  deleteSubTask,
  deleteTask,
  getTasks,
  getTaskById,
} from "../controllers/task.controller.js";

import { validate } from "../middlewares/validator.middleware.js";

import {
  createTaskValidator,
  getTaskDetailsValidator,
  updateTaskValidator,
  deleteTaskValidator,
  createSubTaskValidator,
  updateSubtaskValidator,
  deleteSubTaskValidator,
} from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middlewares.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
const router = Router();
router.use(verifyJWT);

router
  .route("/:projectId")
  .get(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
      UserRolesEnum.MEMBER,
    ]),
    validate,
    getTasks,
  )
  .post(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(
    getTaskDetailsValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
      UserRolesEnum.MEMBER,
    ]),
    getTaskById,
  )
  .put(
    updateTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    updateTask,
  )
  .delete(
    deleteTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    createSubTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createSubTask,
  );

router
  .route("/:projectId/st/:subTaskId")
  .put(
    updateSubtaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.MEMBER,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    updateSubTask,
  )
  .delete(
    deleteSubTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,

      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteSubTask,
  );

export default router;
