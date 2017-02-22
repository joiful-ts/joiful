import 'reflect-metadata';
import {Joi, getJoiSchema} from "./core";
import {ObjectSchema} from "joi";
import {ValidationOptions} from "joi";

export class Validator {
    constructor(
        private defaultOptions? : ValidationOptions
    ) {
    }

    validate(target : any, options? : ValidationOptions) {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema : ObjectSchema = getJoiSchema(target.constructor);
        if (!options) {
            options = this.defaultOptions;
        }
        return Joi.validate(target, classSchema, options);
    }

    validateAsClass(target : any, clz : Function, options? : ValidationOptions) {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema : ObjectSchema = getJoiSchema(clz);
        if (!options) {
            options = this.defaultOptions;
        }
        return Joi.validate(target, classSchema, options);
    }
}
