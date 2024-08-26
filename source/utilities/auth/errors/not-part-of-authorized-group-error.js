import LoginError from "./login-error.js";
import { StatusCodes } from "http-status-codes";

/** For when the user is not part of the required group. */
export default class NotPartOfAuthorizedGroupError extends LoginError {
    constructor(message) {
        super(message);
        this.code = StatusCodes.FORBIDDEN;
        Error.captureStackTrace(this, this.constructor);
    }
}