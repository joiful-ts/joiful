import { NumberSchema, Reference, Schema } from 'joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';

type AllowedPropertyTypes = number;

/**
 * Specifies that the value must be greater than limit.
 * @param limit The amount that the value must be greater than.
 */
export function Greater(limit: number | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).greater(<any>limit);
    });
}

/**
 * Requires the number to be an integer (no floating point).
 */
export function Integer(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).integer();
    });
}

/**
 * Specifies that the value must be less than limit.
 * @param limit The amount that the value must be less than.
 */
export function Less(limit: number | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).less(<any>limit);
    });
}

/**
 * Specifies the maximum value.
 * @param limit The maximum value.
 */
export function Max(limit: number | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).max(<any>limit);
    });
}

/**
 * Specifies the minimum value.
 * @param limit The minimum value.
 */
export function Min(limit: number | Reference): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).min(<any>limit);
    });
}

/**
 * Specifies that a value must be a multiple of base.
 * @param base
 */
export function Multiple(base: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).multiple(base);
    });
}

/**
 * Requires the number to be negative.
 */
export function Negative(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).negative();
    });
}

/**
 * Forces the property to be a number.
 * @param schemaBuilder Optionally allows you to chain together additional constraints.
 */
export function NumberSchema(
    schemaBuilder?: (schema: NumberSchema) => NumberSchema,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        let schema = Joi.number();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

/**
 * Requires the number to be positive.
 */
export function Positive(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).positive();
    });
}

/**
 * Specifies the maximum number of decimal places.
 * @param limit The maximum number of decimal places allowed.
 */
export function Precision(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as NumberSchema).precision(limit);
    });
}
