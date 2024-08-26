import { StatusCodes } from "http-status-codes";

/** A general login error. */
export default class LoginError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.INTERNAL_SERVER_ERROR;
        Error.captureStackTrace(this, this.constructor);
    }
}