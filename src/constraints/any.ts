import { lazy, Reference, Schema, ValidationErrorFunction, ValidationOptions, WhenOptions } from 'joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';

type AllowedPropertyTypes = unknown;

export function Allow(...values: any[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.allow(values);
    });
}

export function AnySchema(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi: { any: () => Schema }) => {
        return Joi.any();
    });
}

/**
 * Returns a new type that is the result of adding the rules of one type to another.
 */
export function Concat(schema: Schema): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((existingSchema: Schema) => {
        return existingSchema.concat(schema);
    });
}

/**
 * Sets a default value if the original value is undefined.
 */
export function Default(value?: any, description?: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.default(value, description);
    });
}

/**
 * Annotates the key where:
 * @param desc - the description string.
 */
export function Description(desc: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.description(desc);
    });
}

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Empty(schema: any): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((existingSchema: Schema) => {
        return existingSchema.empty(schema);
    });
}

export function Error(err: Error | ValidationErrorFunction): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.error!(err);
    });
}

export const CustomError = Error; // Provide an alias for Error, to avoid ambiguity with the built-in Error class/type.

/**
 * Annotates the key where:
 * @param value - an example value.
 * If the example fails to pass validation, the function will throw.
 */
export function Example(value: any): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.example(value);
    });
}

/**
 * Marks a key as forbidden which will not allow any value except undefined. Used to explicitly forbid keys.
 */
export function Forbidden(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.forbidden();
    });
}

export function Invalid(...values: any[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.invalid(values);
    });
}

export const Disallow = Invalid;

export const Not = Invalid;

/**
 * Overrides the key name in error messages.
 */
export function Label(name: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.label(name);
    });
}

export function Lazy(cb: () => Schema): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi: { lazy: typeof lazy }) => {
        return Joi.lazy(cb);
    });
}

/**
 * Attaches metadata to the key where:
 * @param meta - the meta object to attach.
 */
export function Meta(meta: any): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.meta(meta);
    });
}

/**
 * Annotates the key where:
 * @param notes - the notes string or multiple strings.
 */
export function Notes(...notes: string[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.notes(notes);
    });
}

export function Optional(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.optional();
    });
}

/**
 * Overrides the global validate() options for the current key and any sub-key where:
 * @param options - an object with the same optional keys as Joi.validate(value, schema, options, callback).
 */
export function Options(options: ValidationOptions): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.options(options);
    });
}

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Raw(isRaw?: boolean): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.raw(isRaw);
    });
}

export function Required(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.required();
    });
}

/**
 * Strict mode sets the options.convert options to false which
 * prevents type casting for the current key and any child keys.
 * @param isStrict - whether strict mode is enabled or not. Defaults to true.
 */
export function Strict(isStrict?: boolean): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.strict(isStrict);
    });
}

/**
 * Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
 */
export function Strip(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.strip();
    });
}

/**
 * Annotates the key where:
 * @param tags - the tag string or multiple strings.
 */
export function Tags(...tags: string[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.tags(tags);
    });
}

/**
 * Annotates the key where:
 * @param name - the unit name of the value.
 */
export function Unit(name: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.unit(name);
    });
}

export function Valid(...values: any[]): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.valid(values);
    });
}

export const Only = Valid;

export const Equal = Valid;

/**
 * Converts the type into an alternatives type where the conditions are merged into the type definition.
 */
export function When<TWhen>(
    ref: string | Reference,
    options: WhenOptions<TWhen>,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return schema.when<TWhen>(<any>ref, options);
    });
}
