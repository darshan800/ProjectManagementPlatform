import { body, param } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";

//user-registration
const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("username must be atleast 3 charcaters long"),
    body("password").trim().notEmpty().withMessage("password is required"),
    body("fullname").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Invalid email"),

    body("password").notEmpty().withMessage("password is required"),
  ];
};

//user-change current password
const userChangeCurrentPassword = () => {
  return [
    body("oldPassword").notEmpty().withMessage("old password is required"),
    body("newPassword").notEmpty().withMessage("new password is required"),
  ];
};

//user-forgot password validator
const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),
  ];
};

//user-resetforgot password validator
const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("passwoord is required")];
};

//create -project validator
const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("name is required"),

    body("description")
      .notEmpty()
      .withMessage("description should not be empty for project"),
  ];
};

// add members for validators
const addMembersToProjectValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("invalid project Id"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("role")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("role is required")
      .isIn(AvailableUserRole)
      .withMessage("The role you provided is does not exist"),
  ];
};

//create -task validators
const createTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("title is required for the task"),

    body("description")
      .notEmpty()
      .toString()
      .withMessage("Description must be string and not empty"),

    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("assignedTo must be valid user id"),

    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Invalid status value"),
  ];
};

//get-task details
const getTaskDetailsValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projecct id"),
    param("taskId").isMongoId().withMessage("Invalid task id"),
  ];
};
//update-task
const updateTaskValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Inavlid projectId"),
    param("taskId").isMongoId().withMessage("Inavlid taskId"),
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("assignedTo must be valid"),

    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Invalid status"),
  ];
};

//delete -task
const deleteTaskValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId"),
    param("taskId").isMongoId().withMessage("Invalid taskId"),
  ];
};

//create -subtask
const createSubTaskValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId"),
    param("taskId").isMongoId().withMessage("Invalid taskId"),

    body("title").notEmpty().withMessage("Title is required"),
  ];
};

//update-subtask
const updateSubtaskValidator = () => {
  return [
    param("projectId").isMongoId().withMessage("Invalid projectId"),
    param("subTaskId").isMongoId().withMessage("Invalid subTaskId"),
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),

    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be boolean"),
  ];
};

//delete-subtask
const deleteSubTaskValidator = () => {
  return [
    param("projectId").notEmpty().isMongoId().withMessage("Invalid projectId"),
    param("subTaskId").notEmpty().isMongoId().withMessage("Invalid subTaskId"),
  ];
};
export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPassword,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembersToProjectValidator,
  createTaskValidator,
  getTaskDetailsValidator,
  updateTaskValidator,
  deleteTaskValidator,
  createSubTaskValidator,
  updateSubtaskValidator,
  deleteSubTaskValidator,
};
