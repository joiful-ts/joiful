import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders, JoifulOptions, createPropertyDecorator } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface NumberSchemaModifiers extends AnySchemaModifiers {
    /**
     * Specifies that the value must be greater than limit.
     * @param limit The amount that the value must be greater than.
     */
    greater(limit: number): this;

    /**
     * Requires the number to be an integer (no floating point).
     */
    integer(): this;

    /**
     * Specifies that the value must be less than limit.
     * @param limit The amount that the value must be less than.
     */
    less(limit: number): this;

    /**
     * Specifies the maximum value.
     * @param limit The maximum value.
     */
    max(limit: number): this;

    /**
     * Specifies the minimum value.
     * @param limit The minimum value.
     */
    min(limit: number): this;

    /**
     * Specifies that a value must be a multiple of base.
     * @param base
     */
    multiple(base: number): this;

    /**
     * Requires the number to be negative.
     */
    negative(): this;

    /**
     * Requires the number to be positive.
     */
    positive(): this;

    /**
     * Specifies the maximum number of decimal places.
     * @param limit The maximum number of decimal places allowed.
     */
    precision(limit: number): this;
}

export function getNumberSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.NumberSchema, NumberSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        greater: (limit: number) => ({ schema }) => schema.greater(limit),
        integer: () => ({ schema }) => schema.integer(),
        less: (limit: number) => ({ schema }) => schema.less(limit),
        max: (limit: number) => ({ schema }) => schema.max(limit),
        min: (limit: number) => ({ schema }) => schema.min(limit),
        multiple: (base: number) => ({ schema }) => schema.multiple(base),
        negative: () => ({ schema }) => schema.negative(),
        positive: () => ({ schema }) => schema.positive(),
        precision: (limit: number) => ({ schema }) => schema.precision(limit),
    };
    return result;
}

export interface NumberSchemaDecorator extends
    NumberSchemaModifiers,
    TypedPropertyDecorator<number> {
}

export const createNumberPropertyDecorator = (joifulOptions: JoifulOptions) => (
    createPropertyDecorator<number, NumberSchemaModifiers>()(
        ({ joi }) => joi.number(),
        getNumberSchemaModifierProviders,
        joifulOptions,
    )
);
