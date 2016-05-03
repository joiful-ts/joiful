import 'reflect-metadata';
import {SCHEMA_KEY} from "./core";
import * as Joi from "joi";
import {ObjectSchema} from "joi";

export class Validator {
    protected getClassSchema(clz : Function) : ObjectSchema {
        var classSchema : any = Reflect.getMetadata(SCHEMA_KEY, clz.prototype);
        if (!classSchema['isJoi']) {
            classSchema = Joi.object().keys(classSchema);
            Reflect.defineMetadata(SCHEMA_KEY, classSchema, clz.prototype);
        }
        return <ObjectSchema> classSchema;
    }

    validate(target : any) {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        var classSchema : ObjectSchema = this.getClassSchema(target.constructor);
        return Joi.validate(target, classSchema);
    }

    validateAsClass(target : any, clz : Function) {
        if (target === null || target === undefined) {
            throw new Error("Can't validate null objects");
        }

        var classSchema : ObjectSchema = this.getClassSchema(clz);
        return Joi.validate(target, classSchema);
    }
}
