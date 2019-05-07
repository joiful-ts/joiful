import {ArraySchema, Schema} from "joi";
import {typeConstraintDecorator, constraintDecorator} from "../core";

export function ArraySchema(schemaBuilder?: (schema: ArraySchema) => ArraySchema) : PropertyDecorator {
    return typeConstraintDecorator([Array], (Joi) => {
        let schema = Joi.array();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

/**
 * List the types allowed for the array values.
 */
export function Items(type : Schema, ...types : Schema[]) : PropertyDecorator {
    types = [type].concat(types);
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).items(types);
    });
}

export function Length(limit : number) : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).length(limit);
    });
}

export function Max(limit : number) : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).max(limit);
    });
}

export function Min(limit : number) : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).min(limit);
    });
}

/**
 * List the types in sequence order for the array values..
 */
export function Ordered(...types : Schema[]) : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).ordered(types);
    });
}

/**
 * Allow single values to be checked against rules as if it were provided as an array.
 * enabled can be used with a falsy value to go back to the default behavior.
 */
export function Single(enabled? : boolean | any) : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).single(enabled);
    });
}

/**
 * Allow this array to be sparse. enabled can be used with a falsy value to go back to the default behavior.
 */
export function Sparse(enabled? : boolean | any) : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).sparse(enabled);
    });
}

/**
 * Requires the array values to be unique.
 */
export function Unique() : PropertyDecorator {
    return constraintDecorator([Array], (schema : Schema) => {
        return (schema as ArraySchema).unique();
    });
}
