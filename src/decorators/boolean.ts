import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders, JoifulOptions, createPropertyDecorator } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface BooleanSchemaModifiers extends AnySchemaModifiers {
    /**
     * Allows for additional values to be considered valid booleans by converting them to false during validation.
     * Requires the validation convert option to be true.
     * String comparisons are by default case insensitive, see boolean.insensitive() to change this behavior.
     */
    falsy(value: string | number, ...values: Array<string | number>): this;

    /**
     * Allows the values provided to truthy and falsy as well as the "true" and "false" default conversion
     * (when not in strict() mode) to be matched in a case insensitive manner.
     * @param enabled Optional parameter defaulting to true which allows you
     * to reset the behavior of sensitive by providing a falsy value
     */
    sensitive(enabled?: boolean): this;

    /**
     * Allows for additional values to be considered valid booleans by converting them to true during validation.
     * Requires the validation convert option to be true.
     * String comparisons are by default case insensitive, see boolean.insensitive() to change this behavior.
     */
    truthy(value: string | number, ...values: Array<string | number>): this;
}

export function getBooleanSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.BooleanSchema, BooleanSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        falsy: (value: string | number, ...values: Array<string | number>) =>
            ({ schema }) => schema.falsy(value, ...values),
        sensitive: (enabled = true) => ({ schema }) => schema.sensitive(enabled),
        truthy: (value: string | number, ...values: Array<string | number>) =>
            ({ schema }) => schema.truthy(value, ...values),
    };
    return result;
}

export interface BooleanSchemaDecorator extends
    BooleanSchemaModifiers,
    TypedPropertyDecorator<boolean> {
}

export const createBooleanPropertyDecorator = (joifulOptions: JoifulOptions) => (
    createPropertyDecorator<Boolean, BooleanSchemaModifiers>()(
        ({ joi }) => joi.boolean(),
        getBooleanSchemaModifierProviders,
        joifulOptions,
    )
);
