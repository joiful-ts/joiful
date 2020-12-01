import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders, createPropertyDecorator, JoifulOptions } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface DateSchemaModifiers extends AnySchemaModifiers {
    /**
     * Coerces value to a Date object from string value in valid ISO 8601 date format.
     */
    iso(): this;

    /**
     * Specifies the maximum value.
     * @param limit The maximum value.
     */
    max(limit: number | 'now' | string | Date): this;

    /**
     * Specifies the minimum value.
     * @param limit The minimum value.
     */
    min(limit: number | 'now' | string | Date): this;

    /**
     * Coerces value to a Date object from a timestamp interval from Unix/Javascript Time
     * @param type unix or javaScript
     */
    timestamp(type?: 'unix' | 'javascript'): this;
}

export function getDateSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.DateSchema, DateSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        iso: () => ({ schema }) => schema.iso(),
        max: (limit: number | 'now' | string | Date) => ({ schema }) => schema.max(limit as any),
        min: (limit: number | 'now' | string | Date) => ({ schema }) => schema.min(limit as any),
        timestamp: (type?: 'unix' | 'javascript') => ({ schema }) => schema.timestamp(type),
    };
    return result;
}

export interface DateSchemaDecorator extends
    DateSchemaModifiers,
    TypedPropertyDecorator<Date> {
}

export const createDatePropertyDecorator = (joifulOptions: JoifulOptions) => (
    createPropertyDecorator<Date, DateSchemaModifiers>()(
        ({ joi }) => joi.date(),
        getDateSchemaModifierProviders,
        joifulOptions,
    )
);
