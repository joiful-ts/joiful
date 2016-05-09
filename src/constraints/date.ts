import * as Joi from "joi";
import {updateSchema, SCHEMA_KEY, ConstraintDefinitionError} from "../core";
import {getAndUpdateSchema} from "../core";
import {getPropertySchema} from "../core";
import {allowTypes} from "../core";
import {DateSchema} from "joi";
import {Reference} from "joi";

export function DateSchema() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]);

        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schema = Joi.date();
            updateSchema(target, propertyKey, schema);
        }
    }
}

export function Format(format : string|string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]);

        getAndUpdateSchema(target, propertyKey, (schema : DateSchema) => {
            return schema.format(<any>format);
        });
    }
}

export function Iso() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]); // hmm

        getAndUpdateSchema(target, propertyKey, (schema : DateSchema) => {
            return schema.iso();
        });
    }
}

export function Max(limit : number|'now'|string|Date|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]);

        getAndUpdateSchema(target, propertyKey, (schema : DateSchema) => {
            return schema.max(<any>limit);
        });
    }
}

export function Min(limit : number|'now'|string|Date|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]);

        getAndUpdateSchema(target, propertyKey, (schema : DateSchema) => {
            return schema.min(<any>limit);
        });
    }
}

export function Timestamp(type? : 'unix'|'javascript') : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]); // hmm

        getAndUpdateSchema(target, propertyKey, (schema : any) => {
            // TODO: add timestamp to Joi type defintions
            return schema.timestamp(type);
        });
    }
}
