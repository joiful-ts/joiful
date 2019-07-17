import { ValidationError } from '@hapi/joi';

export class MultipleValidationError extends Error {
    constructor(
        public readonly errors: ValidationError[],
    ) {
        super();

        (<any> Object).setPrototypeOf(this, MultipleValidationError.prototype);
    }
}