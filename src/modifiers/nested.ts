import * as Joi from 'joi';
import { TypedPropertyDecorator, ConstraintDefinitionError } from '../core';
import { ModifierProviders } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';

export class NestedPropertyTypeUnknown extends ConstraintDefinitionError {
    name = 'NestedPropertyTypeUnknown';

    constructor(propertyKey: string | Symbol) {
        super(
            `Could not determine the type of the nested property "${String(propertyKey)}". ` +
            'Please pass the class to the Nested() decorator.',
        );
    }
}

export interface NestedSchemaModifiers extends AnySchemaModifiers {
}

export function getNestedSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.Schema, NestedSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
    };
    return result;
}

export interface NestedSchemaDecorator extends
    NestedSchemaModifiers,
    TypedPropertyDecorator<object> {
}
