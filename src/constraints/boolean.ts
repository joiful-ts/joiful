import { BooleanSchema, Schema } from '@hapi/joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';

type AllowedPropertyTypes = boolean;

export function BooleanSchema(
    schemaBuilder?: (schema: BooleanSchema) => BooleanSchema,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        let schema = Joi.boolean();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function Truthy(
    value: string | number,
    ...values: Array<string | number>  // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    values = [value].concat(values);
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as BooleanSchema).truthy(...values);
    });
}

export function Falsy(
    value: string | number,
    ...values: Array<string | number> // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    values = [value].concat(values);
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as BooleanSchema).falsy(...values);
    });
}

export function Insensitive(enabled: boolean = true): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as BooleanSchema).insensitive(enabled);
    });
}
