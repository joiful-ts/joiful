import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders, createPropertyDecorator, JoifulOptions } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface FunctionSchemaModifiers extends AnySchemaModifiers {
    /**
     * Specifies the arity of the function.
     * @param argumentCount The number of arguments the function should contain.
     */
    arity(argumentCount: number): this;

    /**
     * Specifies the maximum arity of the function.
     * @param maxArgumentCount The maximum number of arguments the function should contain.
     */
    maxArity(maxArgumentCount: number): this;

    /**
     * Specifies the minimum arity of the function.
     * @param minArgumentCount The minimum number of arguments the function should contain.
     */
    minArity(minArgumentCount: number): this;
}

export function getFunctionSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.FunctionSchema, FunctionSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        arity: (argumentCount: number) => ({ schema }) => schema.arity(argumentCount),
        maxArity: (maxArgumentCount: number) => ({ schema }) => schema.maxArity(maxArgumentCount),
        minArity: (minArgumentCount: number) => ({ schema }) => schema.minArity(minArgumentCount),
    };
    return result;
}

export interface FunctionSchemaDecorator extends
    FunctionSchemaModifiers,
    TypedPropertyDecorator<Function> {
}

export const createFunctionPropertyDecorator = (joifulOptions: JoifulOptions) => (
    createPropertyDecorator<Function, FunctionSchemaModifiers>()(
        ({ joi }) => joi.func(),
        getFunctionSchemaModifierProviders,
        joifulOptions,
    )
);
