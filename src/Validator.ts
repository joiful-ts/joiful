import { Joi, getJoiSchema, AnyClass, ClassOf } from './core';
import { ObjectSchema, ValidationOptions } from 'joi';
import { ValidationResult } from './ValidationResult';

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

    validateAsClass<TInput, TExpected>(
        target: TInput,
        clz: ClassOf<TExpected>,
        options?: ValidationOptions,
    ): ValidationResult<TInput & Partial<TExpected>> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema: ObjectSchema = getJoiSchema(clz);
        if (!options) {
            options = this.defaultOptions;
        }

        if (options) {
            return Joi.validate(target, classSchema, options);
        } else {
            return Joi.validate(target, classSchema);
        }
    }

    validateArrayAsClass<TInput, TExpected>(
        target: TInput[],
        clz: ClassOf<TExpected>,
        options?: ValidationOptions,
    ): ValidationResult<Array<TInput & Partial<TExpected>>> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null arrays");
        }

        const classSchema: ObjectSchema = getJoiSchema(clz);
        const arraySchema = Joi.array().items(classSchema);

        if (!options) {
            options = this.defaultOptions;
        }

        if (options) { // avoid strict null check issue in TypeScript
            return Joi.validate(target, arraySchema, options);
        } else {
            return Joi.validate(target, arraySchema);
        }
    }
}
