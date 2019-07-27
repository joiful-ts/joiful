import { Joi, getJoiSchema, AnyClass } from './core';
import { ObjectSchema, ValidationOptions } from 'joi';
import { ValidationResult } from './ValidationResult';

export class InvalidTarget extends Error {
    constructor(targetType: 'object' | 'array') {
        super(`Can't validate null ${targetType}s`);
    }
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
