import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unathorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Inavalide access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    // console.log("projectId from params:", projectId); // add this
    // console.log("user id:", req.user._id); // add this

    if (!projectId) {
      throw new ApiError(400, "Project ID is required");
    }

    const project = await ProjectMember.findOne({
      user: new mongoose.Types.ObjectId(req.user._id),
      project: new mongoose.Types.ObjectId(projectId),
    });
    // console.log("project member found:", project); // add this

    if (!project) {
      throw new ApiError(400, "You are not a member of this project");
    }

    const givenRole = project?.role;
    // console.log("givenRole:", givenRole); // add this
    // console.log("roles array:", roles); // add this
    // console.log("includes check:", roles.includes(givenRole)); // add this

    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission for this action to perform",
      );
    }

    // console.log("Permission check passed, calling next()"); // add this
    next();
  });
};
