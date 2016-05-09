import * as Joi from "joi";
import {updateSchema, SCHEMA_KEY, ConstraintDefinitionError} from "../core";
import {getPropertySchema} from "../core";
import {allowTypes} from "../core";
import {getAndUpdateSchema} from "../core";

export function Arity(n : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Function]);

        getAndUpdateSchema(target, propertyKey, (schema : any) => {
            // TODO: add arity to Joi type definitions
            return schema.arity(n);
        });
    }
}

export function FuncSchema() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Function]);

        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schema = Joi.func();
            updateSchema(target, propertyKey, schema);
        }
    }
}

export function MaxArity(n : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Function]);

        getAndUpdateSchema(target, propertyKey, (schema : any) => {
            // TODO: add maxArity to Joi type definitions
            return schema.maxArity(n);
        });
    }
}

export function MinArity(n : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Function]);

        getAndUpdateSchema(target, propertyKey, (schema : any) => {
            // TODO: add minArity to Joi type definitions
            return schema.minArity(n);
        });
    }
}
