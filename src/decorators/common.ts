import * as Joi from 'joi';
import { getJoi, TypedPropertyDecorator, MapAllowUnions, StringOrSymbolKey, updateWorkingSchema } from '../core';

export class NotImplemented extends Error {
    constructor(feature: string) {
        super(`${feature} is not implemented`);
    }
}

export type LabelProvider = <TClass, TKey extends StringOrSymbolKey<TClass>>(
    propertyKey: TKey,
    target: TClass,
) => string | undefined | null;

export interface JoifulOptions {
    joi?: typeof Joi;
    labelProvider?: LabelProvider | undefined;
}

type MethodNames<T> = {
    [K in keyof T]: T extends (...args: any[]) => any ? K : never;
};

interface DecoratorContext<TSchema extends Joi.Schema> {
    schema: TSchema;
    options?: JoifulOptions;
}

export type ModifierProviders<
    TSchema extends Joi.Schema,
    TModifiers,
    > = {
        [K in keyof MethodNames<TModifiers>]: TModifiers[K] extends (...args: any[]) => any ?
        (...args: Parameters<TModifiers[K]>) => (context: DecoratorContext<TSchema>) => TSchema :
        never;
    };

export interface GetBaseSchemaFunction<TSchema, TAllowedTypes> {
    <TClass extends MapAllowUnions<TClass, TKey, TAllowedTypes>, TKey extends StringOrSymbolKey<TClass>>(options: {
        joi: typeof Joi,
        target: TClass,
        propertyKey: TKey,
    }): TSchema;
}

function forEachModifierProvider<TSchema extends Joi.Schema>(
    modifierProviders: ModifierProviders<TSchema, any>,
    callback: (
        modifierName: string,
        modifierProvider: (...args: any[]) => (context: DecoratorContext<TSchema>) => TSchema,
    ) => void,
) {
    Object
        .keys(modifierProviders)
        .forEach((modifierName) => {
            const modifierProvider = modifierProviders[modifierName];
            callback(modifierName, modifierProvider);
        });
}

function indexable<T, TValue>(value: T): T & { [key: string]: TValue } {
    return value as any;
}

export type PropertyDecorator<TAllowedTypes, TSchemaModifiers> = (
    TypedPropertyDecorator<TAllowedTypes> &
    TSchemaModifiers
);

export const createPropertyDecorator = <TAllowedTypes, TSchemaModifiers>() => (
    <TSchema extends Joi.Schema>(
        getBaseSchema: GetBaseSchemaFunction<TSchema, TAllowedTypes>,
        getModifierProviders: (getJoi: () => typeof Joi) => ModifierProviders<TSchema, TSchemaModifiers>,
        options: JoifulOptions,
    ) => {
        let schema: TSchema | undefined;
        let modifiersToApply: ((context: DecoratorContext<TSchema>) => TSchema)[] = [];
        const modifierProviders = getModifierProviders(() => getJoi(options));

        const decoratorUntyped: TypedPropertyDecorator<TAllowedTypes> = (target, propertyKey) => {
            const joi = getJoi(options);

            schema = getBaseSchema({ joi, target, propertyKey });

            if (options.labelProvider) {
                const label = options.labelProvider(propertyKey, target);
                if (typeof label === 'string') {
                    schema = schema.label(label) as TSchema;
                }
            }

            modifiersToApply.forEach((modifierToApply) => {
                schema = modifierToApply({ schema: schema!, options });
            });

            updateWorkingSchema(target, propertyKey, schema);
        };

        const decorator = decoratorUntyped as PropertyDecorator<TAllowedTypes, TSchemaModifiers>;

        forEachModifierProvider(modifierProviders, (modifierName, modifierProvider) => {
            indexable(decoratorUntyped)[modifierName] = (...args: any[]) => {
                modifiersToApply.push(modifierProvider(...args));
                return decorator;
            };
        });

        return decorator;
    }
);
