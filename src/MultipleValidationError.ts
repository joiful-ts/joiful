import {ValidationError} from "joi";

export class MultipleValidationError extends Error {
    constructor(
        private errors : ValidationError[]
    ) {
        super();

        (<any> Object).setPrototypeOf(this, MultipleValidationError.prototype);
    }
}