import { DateSchema, Reference, Schema } from 'joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';

type AllowedPropertyTypes = Date | string;

/**
 * Forces the property to be a Date object.
 * @param schemaBuilder Optionally allows you to chain together additional constraints.
 */
export function DateSchema(
    schemaBuilder?: (schema: DateSchema) => DateSchema,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        let schema = Joi.date();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

/**
 * Coerces value to a Date object from string value in valid ISO 8601 date format.
 */
export function Iso(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).iso();
    });
}

/**
 * Specifies the maximum value.
 * @param limit The maximum value.
 */
export function Max(limit: number | 'now' | string | Date | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).max(<any>limit);
    });
}

/**
 * Specifies the minimum value.
 * @param limit The minimum value.
 */
export function Min(limit: number | 'now' | string | Date | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).min(<any>limit);
    });
}

/**
 * Coerces value to a Date object from a timestamp interval from Unix/Javascript Time
 * @param type unix or javaScript
 */
export function Timestamp(type?: 'unix' | 'javascript'): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as DateSchema).timestamp(type);
    });
}
