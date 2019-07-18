import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';
import { FunctionSchema, Schema } from 'joi';

type AllowedPropertyTypes = Function;

/**
 * Specifies the arity of the function.
 * @param argumentCount The number of arguments the function should contain.
 */
export function Arity(argumentCount: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).arity(argumentCount);
    });
}

/**
 * Forces the property to be a Function.
 * @param schemaBuilder Optionally allows you to chain together additional constraints.
 */
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

/**
 * Specifies the maximum arity of the function.
 * @param maxArgumentCount The maximum number of arguments the function should contain.
 */
export function MaxArity(maxArgumentCount: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).maxArity(maxArgumentCount);
    });
}

/**
 * Specifies the minimum arity of the function.
 * @param minArgumentCount The minimum number of arguments the function should contain.
 */
export function MinArity(minArgumentCount: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as FunctionSchema).minArity(minArgumentCount);
    });
}
