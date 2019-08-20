import { Joi, getJoiSchema, AnyClass } from './core';
import { ObjectSchema, ValidationError, ValidationOptions } from 'joi';

export class MultipleValidationError extends Error {
    constructor(
        public readonly errors: ValidationError[],
    ) {
        super();

        (<any>Object).setPrototypeOf(this, MultipleValidationError.prototype);
    }
}

export interface ValidationResultPass<T> {
    error: null;
    value: T;
}

export interface ValidationResultFail<T> {
    error: ValidationError;
    value: T;
}

export type ValidationResult<T> = ValidationResultPass<T> | ValidationResultFail<T>;

/**
 * Returns true if validation result passed validation.
 * @param validationResult The validation result to test.
 */
export function isValidationPass<T>(
    validationResult: ValidationResult<T>,
): validationResult is ValidationResultPass<T> {
    return !validationResult.error;
}

/**
 * Returns true if validation result failed validation.
 * @param validationResult The validation result to test.
 */
export function isValidationFail<T>(
    validationResult: ValidationResult<T>,
): validationResult is ValidationResultFail<T> {
    return !!validationResult.error;
}

export class Validator {
    constructor(
        private defaultOptions?: ValidationOptions,
    ) {
    }

    validate<T>(target: T, options?: ValidationOptions): ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }
        return this.validateAsClass(target, target.constructor as AnyClass, options);
    }

    validateAsClass<T>(target: T, Class: AnyClass, options?: ValidationOptions): ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema: ObjectSchema = getJoiSchema(Class);
        if (!options) {
            options = this.defaultOptions;
        }
        if (options !== undefined) { // avoid strict null check issue in TypeScript
            return Joi.validate(target, classSchema, options);
        } else {
            return Joi.validate(target, classSchema);
        }
    }

    validateArrayAsClass<T>(target: T[], Class: AnyClass, options?: ValidationOptions): ValidationResult<T[]> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null arrays");
        }

        const classSchema: ObjectSchema = getJoiSchema(Class);
        const arraySchema = Joi.array().items(classSchema);
        if (!options) {
            options = this.defaultOptions;
        }
        if (options !== undefined) { // avoid strict null check issue in TypeScript
            return Joi.validate(target, arraySchema, options);
        } else {
            return Joi.validate(target, arraySchema);
        }
    }
}
