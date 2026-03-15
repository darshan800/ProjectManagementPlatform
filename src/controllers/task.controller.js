import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { SubTask } from "../models/subtask.models.js";
import { Tasks } from "../models/task.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";


const getTasks=asyncHandler(async(req,res)=>{

})

const createTask=asyncHandler(async(req,res)=>{

})


const getTaskById=asyncHandler(async(req,res)=>{

})


const updateTask=asyncHandler(async(req,res)=>{

})


const deleteTask=asyncHandler(async(req,res)=>{

})


const createSubTask=asyncHandler(async(req,res)=>{

})

const updateSubTask=asyncHandler(async(req,res)=>{

})

const deleteSubTask=asyncHandler(async(req,res)=>{

})

export {
    createSubTask,
    createTask,
    updateSubTask,
    updateTask,
    deleteSubTask,
    deleteTask,
    getTasks,
    getTaskById
}