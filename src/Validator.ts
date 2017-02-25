import "reflect-metadata";
import {Joi, getJoiSchema} from "./core";
import {ObjectSchema, ValidationOptions, ValidationResult} from "joi";

export class Validator {
    constructor(
        private defaultOptions? : ValidationOptions
    ) {
    }

    validate<T>(target : T, options? : ValidationOptions) : ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }
        return this.validateAsClass(target, target.constructor, options);
    }

    validateAsClass<T>(target : T, clz : Function, options? : ValidationOptions) : ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema : ObjectSchema = getJoiSchema(clz);
        if (!options) {
            options = this.defaultOptions;
        }
        if (options !== undefined) { // avoid strict null check issue in TypeScript
            return Joi.validate(target, classSchema, options);
        } else {
            return Joi.validate(target, classSchema);
        }
    }
}
