import * as JoiModule from 'joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';
import { Joi } from '../core';

type AllowedPropertyTypes = Array<unknown>;

export function ArraySchema(
    schemaBuilder?: (schema: JoiModule.ArraySchema) => JoiModule.ArraySchema,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        let schema = Joi.array();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function Items(
    type: JoiModule.Schema,
    // tslint:disable-next-line: trailing-comma
    ...types: JoiModule.Schema[]
): TypedPropertyDecorator<AllowedPropertyTypes>;

export function Items(
    itemsSchemaBuilder: (joi: typeof JoiModule) => JoiModule.Schema | JoiModule.Schema[],
): TypedPropertyDecorator<AllowedPropertyTypes>;

/**
 * List the types allowed for the array values.
 */
export function Items(...args: any[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    const [firstArg] = args;

    const itemSchemas: JoiModule.Schema[] = [];

    if (args.length === 1 && typeof firstArg === 'function') {
        const itemSchemaBuilder = firstArg as (joi: typeof JoiModule) => JoiModule.Schema | JoiModule.Schema[];
        const result = itemSchemaBuilder(Joi);
        itemSchemas.push(...result instanceof Array ? result : [result]);
    } else {
        itemSchemas.push(...args);
    }

    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).items(itemSchemas);
    });
}

export function Length(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).length(limit);
    });
}

export function Max(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).max(limit);
    });
}

export function Min(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).min(limit);
    });
}

/**
 * List the types in sequence order for the array values..
 */
export function Ordered(...types: JoiModule.Schema[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).ordered(types);
    });
}

/**
 * Allow single values to be checked against rules as if it were provided as an array.
 * enabled can be used with a falsy value to go back to the default behavior.
 */
export function Single(enabled?: boolean | any): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).single(enabled);
    });
}

/**
 * Allow this array to be sparse. enabled can be used with a falsy value to go back to the default behavior.
 */
export function Sparse(enabled?: boolean | any): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).sparse(enabled);
    });
}

/**
 * Requires the array values to be unique.
 */
export function Unique(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: JoiModule.Schema) => {
        return (schema as JoiModule.ArraySchema).unique();
    });
}
