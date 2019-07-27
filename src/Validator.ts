import { Joi, getJoiSchema, AnyClass } from './core';
import { ObjectSchema, ValidationOptions } from 'joi';
import { ValidationResult } from './ValidationResult';

export class InvalidTarget extends Error {
    constructor(targetType: 'object' | 'array') {
        super(`Can't validate null ${targetType}s`);
    }
}

/**
 * Validator used to validate objects and arrays.
 */
export class Validator {
    constructor(
        private defaultOptions?: ValidationOptions,
    ) {
    }

    /**
     * Validates an instance of a decorated class.
     * @param target Instance of decorated class to validate.
     * @param options Optional validation options to use.
     */
    validate<T>(target: T, options?: ValidationOptions): ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }
        return this.validateAsClass(target, target.constructor as AnyClass, options);
    }

    /**
     * Validates a plain old javascript object against a decorated class.
     * @param target Object to validate.
     * @param clz Decorated class to validate against.
     * @param options Optional validation options to use.
     */
    validateAsClass<T>(target: T, clz: AnyClass, options?: ValidationOptions): ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema: ObjectSchema = getJoiSchema(clz);
        options = options || this.defaultOptions;

        if (options !== undefined) {
            return Joi.validate(target, classSchema, options);
        } else {
            return Joi.validate(target, classSchema);
        }
    }

    /**
     * Validates an array of plain old javascript objects against a decorated class.
     * @param target Objects to validate.
     * @param clz Decorated class to validate against.
     * @param options Optional validation options to use.
     */
    validateArrayAsClass<T>(target: T[], clz: AnyClass, options?: ValidationOptions): ValidationResult<T[]> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null arrays");
        }

        const classSchema: ObjectSchema = getJoiSchema(clz);
        const arraySchema = Joi.array().items(classSchema);
        options = options || this.defaultOptions;

        if (options !== undefined) {
            return Joi.validate(target, arraySchema, options);
        } else {
            return Joi.validate(target, arraySchema);
        }
    }
}
