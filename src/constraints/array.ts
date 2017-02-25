import {ArraySchema, Schema} from "joi";
import {typeConstraintDecorator, constraintDecorator} from "../core";

export namespace ArrayConstraints {
    export function ArraySchema() : PropertyDecorator {
        return typeConstraintDecorator([Array], (Joi) => {
            return Joi.array();
        });
    }

    /**
     * List the types allowed for the array values.
     */
    export function Items(...type : Schema[]) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.items(type);
        });
    }

    export function Length(limit : number) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.length(limit);
        });
    }

    export function Max(limit : number) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.max(limit);
        });
    }

    export function Min(limit : number) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.min(limit);
        });
    }

    /**
     * List the types in sequence order for the array values..
     */
    export function Ordered(...types : Schema[]) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.ordered.apply(schema, types); // hmm?
        });
    }

    /**
     * Allow single values to be checked against rules as if it were provided as an array.
     * enabled can be used with a falsy value to go back to the default behavior.
     */
    export function Single(enabled? : boolean | any) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.single(enabled);
        });
    }

    /**
     * Allow this array to be sparse. enabled can be used with a falsy value to go back to the default behavior.
     */
    export function Sparse(enabled? : boolean | any) : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.sparse(enabled);
        });
    }

    /**
     * Requires the array values to be unique.
     */
    export function Unique() : PropertyDecorator {
        return constraintDecorator([Array], (schema : ArraySchema) => {
            return schema.unique();
        });
    }
}