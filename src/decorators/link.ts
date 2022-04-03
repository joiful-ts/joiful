import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders, createPropertyDecorator, JoifulOptions } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export interface LinkSchemaModifiers extends AnySchemaModifiers {
}

export function getLinkSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.LinkSchema, LinkSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        /* TODO: ref & concat */
    };
    return result;
}

export interface LinkSchemaDecorator extends
    LinkSchemaModifiers,
    TypedPropertyDecorator<any> {
}

export const createLinkPropertyDecorator = (
    reference: string | undefined,
    joifulOptions: JoifulOptions,
): LinkSchemaDecorator => {
    return createPropertyDecorator<any, LinkSchemaModifiers>()(
        ({ joi }) => joi.link(reference),
        getLinkSchemaModifierProviders,
        joifulOptions,
    );
};
