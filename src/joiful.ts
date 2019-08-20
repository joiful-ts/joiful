import * as Joi from 'joi';
import { AnyClass, getJoiSchema, WORKING_SCHEMA_KEY } from './core';
import { AnySchemaModifiers } from './modifiers/any';
import { ArraySchemaModifiers, getArraySchemaModifierProviders } from './modifiers/array';
import { BooleanSchemaModifiers, getBooleanSchemaModifierProviders } from './modifiers/boolean';
import { createPropertyDecorator, JoifulOptions } from './modifiers/common';
import { DateSchemaModifiers, getDateSchemaModifierProviders } from './modifiers/date';
import { FunctionSchemaModifiers, getFunctionSchemaModifierProviders } from './modifiers/function';
import { LazySchemaModifiers, getLazySchemaModifierProviders } from './modifiers/lazy';
import { getNestedSchemaModifierProviders, NestedPropertyTypeUnknown } from './modifiers/nested';
import { NumberSchemaModifiers, getNumberSchemaModifierProviders } from './modifiers/number';
import { StringSchemaModifiers, getStringSchemaModifierProviders } from './modifiers/string';
import { Validator, MultipleValidationError } from './validation';
import { getObjectSchemaModifierProviders, ObjectSchemaModifiers } from './modifiers/object';

export interface ArrayOptions {
    elementClass?: AnyClass;
}

export interface ObjectOptions {
    objectClass?: AnyClass;
}

export class Joiful {
    constructor(options?: JoifulOptions) {
        this.options = options || {};
    }

    private options: JoifulOptions;

    get joi() {
        return (this.options && this.options.joi) || Joi;
    }

    array = (options?: ArrayOptions) => createPropertyDecorator<Array<any>, ArraySchemaModifiers>()(
        () => {
            let schema = this.joi.array();

            const elementClass = (options && options.elementClass);

            if (elementClass) {
                const elementSchema = getJoiSchema(elementClass);
                schema = schema.items(elementSchema);
            }

            return schema;
        },
        getArraySchemaModifierProviders(() => this.joi),
        this.options,
    )

    boolean = () => createPropertyDecorator<Boolean, BooleanSchemaModifiers>()(
        () => this.joi.boolean(),
        getBooleanSchemaModifierProviders(() => this.joi),
        this.options,
    )

    date = () => createPropertyDecorator<Date, DateSchemaModifiers>()(
        () => this.joi.date(),
        getDateSchemaModifierProviders(() => this.joi),
        this.options,
    )

    func = () => createPropertyDecorator<Function, FunctionSchemaModifiers>()(
        () => this.joi.func(),
        getFunctionSchemaModifierProviders(() => this.joi),
        this.options,
    )

    lazy = (
        getSchema: ({ joi }: { joi: typeof Joi }) => Joi.Schema,
    ) => createPropertyDecorator<any, LazySchemaModifiers>()(
        () => this.joi.lazy(() => getSchema({ joi: this.joi })),
        getLazySchemaModifierProviders(() => this.joi),
        this.options,
    )

    nested = (Class?: AnyClass) => createPropertyDecorator<object, AnySchemaModifiers>()(
        (target, propertyKey) => {
            const propertyType: AnyClass = Class || Reflect.getMetadata('design:type', target, propertyKey);
            if (!propertyType || propertyType === Object) {
                throw new NestedPropertyTypeUnknown(propertyKey);
            }
            return getJoiSchema(propertyType);
        },
        getNestedSchemaModifierProviders(() => this.joi),
        this.options,
    )

    number = () => createPropertyDecorator<number, NumberSchemaModifiers>()(
        () => this.joi.number(),
        getNumberSchemaModifierProviders(() => this.joi),
        this.options,
    )

    object = (options?: ObjectOptions) => createPropertyDecorator<object, ObjectSchemaModifiers>()(
        (target, propertyKey) => {
            const elementType = (options && options.objectClass) ?
                options.objectClass :
                Reflect.getMetadata('design:type', target, propertyKey);

            const schema = (elementType && elementType !== Object) ?
                getJoiSchema(elementType) :
                this.joi.object();

            return schema;
        },
        getObjectSchemaModifierProviders(() => this.joi),
        this.options,
    )

    string = () => createPropertyDecorator<string, StringSchemaModifiers>()(
        () => this.joi.string(),
        getStringSchemaModifierProviders(() => this.joi),
        this.options,
    )

    validate = (options?: { validator?: Validator }): MethodDecorator => {
        const validator = (options || { validator: undefined }).validator || new Validator();

        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const original = descriptor.value;
            descriptor.value = function (...args: any[]) {
                const types = Reflect.getMetadata('design:paramtypes', target, propertyKey);
                const failures: Joi.ValidationError[] = [];
                const newArgs: any[] = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    const argType = types[i];
                    const workingSchema = Reflect.getMetadata(WORKING_SCHEMA_KEY, argType.prototype);
                    if (workingSchema) {
                        let result = validator.validateAsClass(arg, argType);
                        if (result.error != null) {
                            failures.push(result.error);
                        }
                        newArgs.push(result.value);
                    } else {
                        newArgs.push(arg);
                    }
                }
                if (failures.length > 0) {
                    throw new MultipleValidationError(failures);
                } else {
                    return original.apply(this, newArgs);
                }
            };
            return descriptor;
        };
    }
}
