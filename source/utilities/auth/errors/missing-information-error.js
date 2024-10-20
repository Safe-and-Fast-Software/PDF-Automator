import LoginError from "#source/utilities/auth/errors/login-error.js";
import { StatusCodes } from "http-status-codes";

/** For when there's missing information. */
export default class MissingInformationLoginError extends LoginError {
    constructor(message) {
        super(message);
        this.code = StatusCodes.NOT_ACCEPTABLE;
        Error.captureStackTrace(this, this.constructor);
    }
}