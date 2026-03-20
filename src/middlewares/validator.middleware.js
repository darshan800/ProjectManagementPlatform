import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

// so the task is , i'll give you some file , you need to extract error from it and
// you will just process them,
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErros = [];
  errors.array().map((err) =>
    extractedErros.push({
      [err.path]: err.msg,
    }),
  );
  console.log(extractedErros);

  throw new ApiError(422, "Rececived data is not valid", extractedErros);
};
