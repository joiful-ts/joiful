import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';
import { FunctionSchema, Schema } from '@hapi/joi';

type AllowedPropertyTypes = Function;

export function Arity(n: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).arity(n);
    });
}

export function FuncSchema(
    schemaBuilder?: (schema: FunctionSchema) => FunctionSchema,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        let schema = Joi.func();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function MaxArity(n: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).maxArity(n);
    });
}

export function MinArity(n: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).minArity(n);
    });
}
