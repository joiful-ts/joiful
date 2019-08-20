import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface LazySchemaModifiers extends AnySchemaModifiers {
}

export function getLazySchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.Schema, LazySchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
    };
    return result;
}

export interface LazySchemaDecorator extends
    LazySchemaModifiers,
    TypedPropertyDecorator<any> {
}
