import * as Joi from '@hapi/joi';
import { createPropertyDecorator, JoifulOptions, ModifierProviders, NotImplemented } from './common';
import { TypedPropertyDecorator } from '../core';

export interface AnySchemaModifiers {
    /**
     * Whitelists values.
     * Note that this list of allowed values is in addition to any other permitted values.
     * To create an exclusive list of values, use the `Valid` decorator.
     * @param values Values to be whitelisted.
     */
    allow(value: any, ...values: any[]): this;

    /**
     * Adds the provided values into the allowed whitelist for property
     * and marks them as the only valid values allowed.
     * @param values The only valid values this property can accept.
     */
    valid(value: any, ...values: any[]): this;
    valid(values: any[]): this;

    /**
     * Adds the provided values into the allowed whitelist for property
     * and marks them as the only valid values allowed.
     */
    only(): this;

    /**
     * Adds the provided values into the allowed whitelist for property
     * and marks them as the only valid values allowed.
     * @param values The only valid values this property can accept.
     */
    equal(value: any, ...values: any[]): this;
    equal(values: any[]): this;

    /**
     * Blacklists values for this property.
     * @param values Values to be blacklisted.
     */
    invalid(value: any, ...values: any[]): this;
    invalid(values: any[]): this;

    /**
     * Blacklists values for this property.
     * @param values Values to be blacklisted.
     */
    disallow(value: any, ...values: any[]): this;
    disallow(values: any[]): this;

    /**
     * Blacklists values for this property.
     * @param values Values to be blacklisted.
     */
    not(value: any, ...values: any[]): this;
    not(values: any[]): this;

    /**
     * Marks a key as required which will not allow undefined as value. All keys are optional by default.
     */
    required(): this;

    /**
     * Marks a key as optional which will allow undefined as values.
     * Used to annotate the schema for readability as all keys are optional by default.
     */
    optional(): this;

    /**
     * Marks a key as forbidden which will not allow any value except undefined. Used to explicitly forbid keys.
     */
    forbidden(): this;

    /**
     * Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
     */
    strip(): this;

    /**
     * Annotates the key
     */
    description(desc: string): this;

    /**
     * Annotates the key
     */
    note(notes: string | string[]): this;

    /**
     * Annotates the key
     */
    tag(tag: string | string[], ...tags: string[]): this;
    //tag(tags: string[]): this;

    /**
     * Attaches metadata to the key.
     */
    meta(meta: Object): this;

    /**
     * Annotates the key with an example value, must be valid.
     */
    example(value: any): this;

    /**
     * Annotates the key with an unit name.
     */
    unit(name: string): this;

    /**
     * Overrides the global validate() options for the current key and any sub-key.
     */
    options(options: Joi.ValidationOptions): this;

    /**
     * Sets the options.convert options to false which prevent type casting for the current key and any child keys.
     */
    strict(isStrict?: boolean): this;

    /**
     * Sets a default value.
     * @param value - the value.
     */
    default(value: any): this;

    /**
     * Overrides the key name in error messages.
     * @param label The label to use.
     */
    label(label: string): this;

    /**
     * Outputs the original untouched value instead of the casted value.
     */
    raw(isRaw?: boolean): this;

    /**
     * Considers anything that matches the schema to be empty (undefined).
     * @param schema - any object or joi schema to match. An undefined schema unsets that rule.
     */
    empty(schema?: any): this;

    /**
     * Overrides the default joi error with a custom error if the rule fails where:
     * @param err - can be:
     *   an instance of `Error` - the override error.
     *   a `function (errors)`, taking an array of errors as argument, where it must either:
     *    return a `string` - substitutes the error message with this text
     *    return a single `object` or an `Array` of it, where:
     *     `type` - optional parameter providing the type of the error (eg. `number.min`).
     *     `message` - optional parameter if `template` is provided, containing the text of the error.
     *     `template` - optional parameter if `message` is provided, containing a template string,
     *                  using the same format as usual joi language errors.
     *     `context` - optional parameter, to provide context to your error if you are using the `template`.
     *    return an `Error` - same as when you directly provide an `Error`,
     *    but you can customize the error message based on the errors.
     * Note that if you provide an `Error`, it will be returned as-is, unmodified and undecorated with any of the
     * normal joi error properties. If validation fails and another error is found before the error
     * override, that error will be returned and the override will be ignored (unless the `abortEarly`
     * option has been set to `false`).
     */
    error(err: Error | Joi.ValidationErrorFunction): this;

    /**
     * Allows specify schemas directly via Joi's schema api.
     */
    custom: (schemaBuilder: (options: { schema: Joi.Schema, joi: typeof Joi }) => Joi.Schema) => this;
}

export function getAnySchemaModifierProviders<TSchema extends Joi.Schema>(getJoi: () => typeof Joi) {
    const result: ModifierProviders<TSchema, AnySchemaModifiers> = {
        allow: (value: any, ...values: any[]) => ({ schema }) =>
            schema.allow(...(value instanceof Array ? [...value, ...values] : [value, ...values])) as TSchema,
        valid: (value: any, ...values: any[]) => ({ schema }) =>
            schema.valid(...(value instanceof Array ? [...value, ...values] : [value, ...values])) as TSchema,
        only: () => ({ schema }) => schema.only() as TSchema,
        equal: (value: any, ...values: any[]) => ({ schema }) =>
            schema.equal(...(value instanceof Array ? [...value, ...values] : [value, ...values])) as TSchema,

        required: () => ({ schema }) => schema.required() as TSchema,
        optional: () => ({ schema }) => schema.optional() as TSchema,

        invalid: (value: any, ...values: any[]) => ({ schema }) => schema.invalid(value, ...values) as TSchema,
        disallow: (value: any, ...values: any[]) => ({ schema }) => schema.disallow(value, ...values) as TSchema,
        not: (value: any, ...values: any[]) => ({ schema }) => schema.not(value, ...values) as TSchema,

        forbidden: () => ({ schema }) => schema.forbidden() as TSchema,

        strip: () => ({ schema }) => schema.strip() as TSchema,

        description: (description: string) => ({ schema }) => schema.description(description) as TSchema,

        note: (notes: string | string[]) => ({ schema }) => schema.note(notes as any) as TSchema,

        tag: (tag: string | string[], ...tags: string[]) => ({ schema }) =>
            schema.tag(...(tag instanceof Array ? [...tag, ...tags] : [tag, ...tags])) as TSchema,

        meta: (meta: Object) => ({ schema }) => schema.meta(meta) as TSchema,

        example: (value: any) => ({ schema }) => schema.example(value) as TSchema,

        unit: (name: string) => ({ schema }) => schema.unit(name) as TSchema,

        options: (options: Joi.ValidationOptions) => ({ schema }) => schema.options(options) as TSchema,

        strict: (isStrict = true) => ({ schema }) => schema.strict(isStrict) as TSchema,

        default: (value: any) => ({ schema }) => schema.default(value) as TSchema,

        label: (label: string) => ({ schema }) => schema.label(label) as TSchema,

        raw: (isRaw = true) => ({ schema }) => schema.raw(isRaw) as TSchema,

        empty: (schema?: any) => ({ schema: existingSchema }) => existingSchema.empty(schema) as TSchema,

        error: (err: Error | Joi.ValidationErrorFunction) => ({ schema }) => {
            if (!schema.error) {
                throw new NotImplemented('Joi.error');
            }
            return schema.error(err) as TSchema;
        },

        custom: (schemaBuilder) => ({ schema }) => schemaBuilder({ schema, joi: getJoi() }) as TSchema,
    };
    return result;
}

export interface AnySchemaDecorator extends
    AnySchemaModifiers,
    TypedPropertyDecorator<any> {
}

export const createAnyPropertyDecorator = (joifulOptions: JoifulOptions) => (
    createPropertyDecorator<any, AnySchemaModifiers>()(
        ({ joi }) => joi.any(),
        getAnySchemaModifierProviders,
        joifulOptions,
    )
);
