import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface ObjectSchemaModifiers extends AnySchemaModifiers {
    keys(keyShemaMap: Joi.SchemaMap | ((joi: typeof Joi) => Joi.SchemaMap)): this;
}

export function getObjectSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.ObjectSchema, ObjectSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        keys: (keyShemaMap) => ({ schema }) => schema.keys(
            (typeof keyShemaMap === 'function') ?
                keyShemaMap(getJoi()) :
                keyShemaMap,
        ),
    };
    return result;
}

export interface ObjectSchemaDecorator extends
    ObjectSchemaModifiers,
    TypedPropertyDecorator<boolean> {
}
