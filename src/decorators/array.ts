import * as Joi from 'joi';
import { TypedPropertyDecorator, AnyClass, getJoiSchema } from '../core';
import { ModifierProviders, JoifulOptions, createPropertyDecorator } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

type AllowedPropertyTypes = any[];

export interface ArraySchemaModifiers extends AnySchemaModifiers {
    /**
     * Requires the array to be an exact length.
     */
    exactLength(limit: number): this;

    /**
     * List the types allowed for the array values.
     */
    items(type: Joi.Schema, ...types: Joi.Schema[]): this;

    /**
     * List the types allowed for the array values.
     */
    items(itemsSchemaBuilder: (joi: typeof Joi) => Joi.Schema | Joi.Schema[]): this;

    /**
     * Specifies the maximum array length.
     * @param limit The maximum length.
     */
    max(limit: number): this;

    /**
     * Specifies the minimum array length.
     * @param limit The minimum length.
     */
    min(limit: number): this;

    /**
     * List the types in sequence order for the array values..
     */
    ordered(type: Joi.Schema, ...types: Joi.Schema[]): this;

    /**
     * List the types in sequence order for the array values..
     */
    ordered(itemsSchemaBuilder: (joi: typeof Joi) => Joi.Schema[]): this;

    /**
     * Allow single values to be checked against rules as if it were provided as an array.
     * enabled can be used with a falsy value to go back to the default behavior.
     */
    single(enabled?: boolean | any): this;

    /**
     * Allow this array to be sparse. enabled can be used with a falsy value to go back to the default behavior.
     */
    sparse(enabled?: boolean | any): this;

    /**
     * Requires the array values to be unique.
     */
    unique(): this;
}

export function getArraySchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.ArraySchema, ArraySchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),

        items: (...args: any[]) => ({ schema }) => {
            const [firstArg] = args;

            const itemSchemas: Joi.Schema[] = [];

            if (args.length === 1 && typeof firstArg === 'function') {
                const itemSchemaBuilder = firstArg as (joi: typeof Joi) => Joi.Schema | Joi.Schema[];
                const result = itemSchemaBuilder(getJoi());
                itemSchemas.push(...result instanceof Array ? result : [result]);
            } else {
                itemSchemas.push(...args);
            }

            return schema.items(...itemSchemas);
        },

        exactLength: (length: number) => ({ schema }) => schema.length(length),

        max: (limit: number) => ({ schema }) => schema.max(limit),

        min: (limit: number) => ({ schema }) => schema.min(limit),

        ordered: (...args: any[]) => ({ schema }) => {
            const [firstArg] = args;

            const itemSchemas: Joi.Schema[] = [];

            if (args.length === 1 && typeof firstArg === 'function') {
                const itemSchemaBuilder = firstArg as (joi: typeof Joi) => Joi.Schema[];
                const result = itemSchemaBuilder(getJoi());
                itemSchemas.push(...result);
            } else {
                itemSchemas.push(...args);
            }

            return schema.ordered(...itemSchemas);
        },

        single: (enabled?: boolean | any) => ({ schema }) => schema.single(enabled),

        sparse: (enabled?: boolean | any) => ({ schema }) => schema.sparse(enabled),

        unique: () => ({ schema }) => schema.unique(),
    };

    return result;
}

export interface ArraySchemaDecorator extends
    ArraySchemaModifiers,
    TypedPropertyDecorator<AllowedPropertyTypes> {
}

export interface ArrayPropertyDecoratorOptions {
    elementClass?: AnyClass;
}

export const createArrayPropertyDecorator = (
    options: ArrayPropertyDecoratorOptions | undefined,
    joifulOptions: JoifulOptions,
) => {
    return createPropertyDecorator<Array<any>, ArraySchemaModifiers>()(
        ({ joi }) => {
            let schema = joi.array();

            const elementClass = (options && options.elementClass);

            if (elementClass) {
                const elementSchema = getJoiSchema(elementClass, joi);
                if (elementSchema) {
                    schema = schema.items(elementSchema);
                }
            }

            return schema;
        },
        getArraySchemaModifierProviders,
        joifulOptions,
    );
};
