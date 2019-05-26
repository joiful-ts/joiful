import { DateSchema, Reference, Schema } from 'joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';

type AllowedPropertyTypes = Date | string;

export function DateSchema(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        return Joi.date();
    });
}

export function Iso(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).iso();
    });
}

export function Max(limit: number | 'now' | string | Date | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).max(<any>limit);
    });
}

export function Min(limit: number | 'now' | string | Date | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).min(<any>limit);
    });
}

export function Timestamp(type?: 'unix' | 'javascript'): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).timestamp(type);
    });
}
