import {Reference, NumberSchema, Schema} from "joi";
import {constraintDecorator, typeConstraintDecorator} from "../core";

export function Greater(limit : number | Reference) : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).greater(<any>limit);
    });
}

export function Integer() : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).integer();
    });
}

export function Less(limit : number | Reference) : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).less(<any>limit);
    });
}

export function Max(limit : number | Reference) : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).max(<any>limit);
    });
}

export function Min(limit : number | Reference) : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).min(<any>limit);
    });
}

export function Multiple(base : number) : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).multiple(base);
    });
}

export function Negative() : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).negative();
    });
}

export function NumberSchema(schemaBuilder?: (schema: NumberSchema) => NumberSchema) : PropertyDecorator {
    return typeConstraintDecorator([Number], (Joi) => {
        let schema = Joi.number();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function Positive() : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).positive();
    });
}

export function Precision(limit : number) : PropertyDecorator {
    return constraintDecorator([Number], (schema : Schema) => {
        return (schema as NumberSchema).precision(limit);
    });
}
