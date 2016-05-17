import {DateSchema} from "joi";
import {Reference} from "joi";
import {typeConstraintDecorator} from "../core";
import {constraintDecorator} from "../core";

export function DateSchema() : PropertyDecorator {
    return typeConstraintDecorator([Date, String], (Joi : { date : () => DateSchema }) => {
        return Joi.date();
    });
}

export function Format(format : string|string[]) : PropertyDecorator {
    return constraintDecorator([Date, String], (schema : DateSchema) => {
        return schema.format(<any>format);
    });
}

export function Iso() : PropertyDecorator {
    return constraintDecorator([Date, String], (schema : DateSchema) => {
        return schema.iso();
    });
}

export function Max(limit : number|'now'|string|Date|Reference) : PropertyDecorator {
    return constraintDecorator([Date, String], (schema : DateSchema) => {
        return schema.max(<any>limit);
    });
}

export function Min(limit : number|'now'|string|Date|Reference) : PropertyDecorator {
    return constraintDecorator([Date, String], (schema : DateSchema) => {
        return schema.min(<any>limit);
    });
}

export function Timestamp(type? : 'unix'|'javascript') : PropertyDecorator {
    return constraintDecorator([Date, String], (schema : DateSchema) => {
        return schema.timestamp(type);
    });
}
