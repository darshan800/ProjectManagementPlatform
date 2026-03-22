import mongoose, { Mongoose, Schema } from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";

//task belongs to user, project , subtask ,
//so we need to link it to all three
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: TaskStatusEnum.TODO,
    },

    attachments:{
        type:[{
            type:String,
            mimetype:String,
            size:Number
        }],
        default:[]
    }
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
