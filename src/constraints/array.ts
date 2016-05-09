import * as Joi from "joi";
import {updateSchema, SCHEMA_KEY, ConstraintDefinitionError} from "../core";
import {getPropertySchema} from "../core";
import {allowTypes} from "../core";
import {getAndUpdateSchema} from "../core";
import {ArraySchema} from "joi";
import {Reference} from "joi";
import {Schema} from "joi";

export function ArraySchema() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Array]);

        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schema = Joi.array();
            updateSchema(target, propertyKey, schema);
        }
    }
}

/**
 * List the types allowed for the array values.
 */
export function Items(...type : Schema[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.items(type);
        });
    }
}

export function Length(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Array]);

        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.length(limit);
        });
    }
}

export function Max(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Array]);

        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.max(limit);
        });
    }
}

export function Min(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Array]);

        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.min(limit);
        });
    }
}

/**
 * List the types in sequence order for the array values..
 */
export function Ordered(...type : Schema[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : any) => {
            // TODO: add ordered to the Joi type definitions
            return schema.ordered(type);
        });
    }
}

/**
 * Allow single values to be checked against rules as if it were provided as an array.
 * enabled can be used with a falsy value to go back to the default behavior.
 */
export function Single(enabled? : boolean|any) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.single(enabled);
        });
    }
}

/**
 * Allow this array to be sparse. enabled can be used with a falsy value to go back to the default behavior.
 */
export function Sparse(enabled? : boolean|any) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.sparse(enabled);
        });
    }
}

/**
 * Requires the array values to be unique.
 */
export function Unique() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.unique();
        });
    }
}

