import {NumberSchema, Reference, Schema} from "joi";
import {constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator} from "../core";

type AllowedPropertyTypes = number;

export function Greater(limit : number | Reference) : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).greater(<any>limit);
    });
}

export function Integer() : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).integer();
    });
}

export function Less(limit : number | Reference) : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).less(<any>limit);
    });
}

export function Max(limit : number | Reference) : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).max(<any>limit);
    });
}

export function Min(limit : number | Reference) : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).min(<any>limit);
    });
}

export function Multiple(base : number) : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).multiple(base);
    });
}

export function Negative() : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).negative();
    });
}

export function NumberSchema() : TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        return Joi.number();
    });
}

export function Positive() : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).positive();
    });
}

export function Precision(limit : number) : TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema : Schema) => {
        return (schema as NumberSchema).precision(limit);
    });
}
