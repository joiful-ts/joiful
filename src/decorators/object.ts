import * as Joi from 'joi';
import { TypedPropertyDecorator, getJoiSchema, AnyClass } from '../core';
import { ModifierProviders, JoifulOptions, createPropertyDecorator } from './common';
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

export interface ObjectPropertyDecoratorOptions {
    objectClass?: AnyClass;
}

export const createObjectPropertyDecorator = (
    options: ObjectPropertyDecoratorOptions | undefined,
    joifulOptions: JoifulOptions,
) => (
        createPropertyDecorator<object, ObjectSchemaModifiers>()(
            ({ joi, target, propertyKey }) => {
                const elementType = (options && options.objectClass) ?
                    options.objectClass :
                    Reflect.getMetadata('design:type', target, propertyKey);

                const schema = (
                    (elementType && elementType !== Object) && getJoiSchema(elementType, joi)
                 ) || joi.object();

                return schema;
            },
            getObjectSchemaModifierProviders,
            joifulOptions,
        )
    );
