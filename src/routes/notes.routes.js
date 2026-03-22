import { Router } from "express";

import {
  getNotes,
  createNotes,
  getNotesById,
  updateNotes,
  deleteNotes,
} from "../controllers/notes.controller.js";

import { validate } from "../middlewares/validator.middleware.js";

import {
  getNotesValiadtor,
  createNotesValidator,
  getNotesByIdValidator,
  updateNotesValidator,
  deleteNotesValidator,
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
  .get(getNotesValiadtor(), validate, getNotes)
  .post(
    createNotesValidator(),
    validate,
    validateProjectPermission(["admin"]),
    createNotes,
  );

router
  .route("/:projectId/n/:noteId")
  .get(getNotesByIdValidator(), validate, getNotesById)
  .put(
    updateNotesValidator(),
    validate,
    validateProjectPermission(["admin"]),
    updateNotes,
  )
  .delete(
    deleteNotesValidator(),
    validate,
    validateProjectPermission(["admin"]),
    deleteNotes,
  );

export default router;
