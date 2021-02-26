import { StatusCodes } from 'http-status-codes';
import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    
    reason = "Error connecting to database"
    
    constructor() {
        super("Error connecting to database")

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}