import {DateSchema, Reference, Schema} from "joi";
import {typeConstraintDecorator, constraintDecorator} from "../core";

export namespace DateConstraints {
    export function DateSchema() : PropertyDecorator {
        return typeConstraintDecorator([Date, String], (Joi) => {
            return Joi.date();
        });
    }

    export function Iso() : PropertyDecorator {
        return constraintDecorator([Date, String], (schema : Schema) => {
            return (schema as DateSchema).iso();
        });
    }

    export function Max(limit : number | 'now' | string | Date | Reference) : PropertyDecorator {
        return constraintDecorator([Date, String], (schema : Schema) => {
            return (schema as DateSchema).max(<any>limit);
        });
    }

    export function Min(limit : number | 'now' | string | Date | Reference) : PropertyDecorator {
        return constraintDecorator([Date, String], (schema : Schema) => {
            return (schema as DateSchema).min(<any>limit);
        });
    }

    export function Timestamp(type? : 'unix' | 'javascript') : PropertyDecorator {
        return constraintDecorator([Date, String], (schema : Schema) => {
            return (schema as DateSchema).timestamp(type);
        });
    }
}