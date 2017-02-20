import 'reflect-metadata';
import {SCHEMA_KEY, Joi} from "./core";
import {ObjectSchema} from "joi";
import {ValidationOptions} from "joi";

// TODO: support using an instance of Joi supplied by the consuming app.
// (To support extensions)
// TODO: set default validation options

export class Validator {
    private defaultOptions : ValidationOptions | undefined;

    constructor(
        defaultOptions? : ValidationOptions
    ) {
       this.defaultOptions = defaultOptions;
    }

    protected getClassSchema(clz : Function) : ObjectSchema {
        var classSchema : any = Reflect.getMetadata(SCHEMA_KEY, clz.prototype);
        if (!classSchema['isJoi']) {
            classSchema = Joi.object().keys(classSchema);
            Reflect.defineMetadata(SCHEMA_KEY, classSchema, clz.prototype);
        }
        return <ObjectSchema> classSchema;
    }

    validate(target : any, options? : ValidationOptions) {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema : ObjectSchema = this.getClassSchema(target.constructor);
        if (!options) {
            options = this.defaultOptions;
        }
        return Joi.validate(target, classSchema, options);
    }

    validateAsClass(target : any, clz : Function, options? : ValidationOptions) {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        const classSchema : ObjectSchema = this.getClassSchema(clz);
        if (!options) {
            options = this.defaultOptions;
        }
        return Joi.validate(target, classSchema, options);
    }
}
