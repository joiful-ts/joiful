import {lazy, Reference, Schema, ValidationOptions, WhenOptions} from "joi";
import {constraintDecorator, StringOrSymbolKey, typeConstraintDecorator, TypedPropertyDecorator} from "../core";

type AllowedPropertyTypes = unknown;

export function Allow<TClass, TKey extends StringOrSymbolKey<TClass>>(...values : any[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.allow(values);
    });
}

export function AnySchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi : { any : () => Schema }) => {
        return Joi.any();
    });
}

/**
 * Returns a new type that is the result of adding the rules of one type to another.
 */
export function Concat<TClass, TKey extends StringOrSymbolKey<TClass>>(schema : Schema) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.concat(schema);
    });
}

/**
 * Sets a default value if the original value is undefined.
 */
export function Default<TClass, TKey extends StringOrSymbolKey<TClass>>(value? : any, description? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.default(value, description);
    });
}

/**
 * Annotates the key where:
 * @param desc - the description string.
 */
export function Description<TClass, TKey extends StringOrSymbolKey<TClass>>(desc : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.description(desc);
    });
}

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Empty<TClass, TKey extends StringOrSymbolKey<TClass>>(schema : any) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.empty(schema);
    });
}

/**
 * Annotates the key where:
 * @param value - an example value.
 * If the example fails to pass validation, the function will throw.
 */
export function Example<TClass, TKey extends StringOrSymbolKey<TClass>>(value : any) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.example(value);
    });
}

/**
 * Marks a key as forbidden which will not allow any value except undefined. Used to explicitly forbid keys.
 */
export function Forbidden<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.forbidden();
    });
}

export function Invalid<TClass, TKey extends StringOrSymbolKey<TClass>>(...values : any[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.invalid(values);
    });
}

export const Disallow = Invalid;

export const Not = Invalid;

/**
 * Overrides the key name in error messages.
 */
export function Label<TClass, TKey extends StringOrSymbolKey<TClass>>(name : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.label(name);
    });
}

export function Lazy<TClass, TKey extends StringOrSymbolKey<TClass>>(cb : () => Schema) : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi : { lazy: typeof lazy }) => {
        return Joi.lazy(cb);
    });
}

/**
 * Attaches metadata to the key where:
 * @param meta - the meta object to attach.
 */
export function Meta<TClass, TKey extends StringOrSymbolKey<TClass>>(meta : any) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.meta(meta);
    });
}

/**
 * Annotates the key where:
 * @param notes - the notes string or multiple strings.
 */
export function Notes<TClass, TKey extends StringOrSymbolKey<TClass>>(...notes : string[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.notes(notes);
    });
}

export function Optional<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.optional();
    });
}

/**
 * Overrides the global validate() options for the current key and any sub-key where:
 * @param options - an object with the same optional keys as Joi.validate(value, schema, options, callback).
 */
export function Options<TClass, TKey extends StringOrSymbolKey<TClass>>(options : ValidationOptions) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.options(options);
    });
}

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Raw<TClass, TKey extends StringOrSymbolKey<TClass>>(isRaw? : boolean) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.raw(isRaw);
    });
}

export function Required<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.required();
    });
}

/**
 * Strict mode sets the options.convert options to false which prevent type casting for the current key and any child keys.
 * @param isStrict - whether strict mode is enabled or not. Defaults to true.
 */
export function Strict<TClass, TKey extends StringOrSymbolKey<TClass>>(isStrict? : boolean) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.strict(isStrict);
    });
}

/**
 * Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
 */
export function Strip<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.strip();
    });
}

/**
 * Annotates the key where:
 * @param tags - the tag string or multiple strings.
 */
export function Tags<TClass, TKey extends StringOrSymbolKey<TClass>>(...tags : string[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.tags(tags);
    });
}

/**
 * Annotates the key where:
 * @param name - the unit name of the value.
 */
export function Unit<TClass, TKey extends StringOrSymbolKey<TClass>>(name : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.unit(name);
    });
}

export function Valid<TClass, TKey extends StringOrSymbolKey<TClass>>(...values : any[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.valid(values);
    });
}

export const Only = Valid;

export const Equal = Valid;

/**
 * Converts the type into an alternatives type where the conditions are merged into the type definition.
 */
export function When<TClass, TKey extends StringOrSymbolKey<TClass>, TWhen>(ref : string | Reference, options : WhenOptions<TWhen>) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return schema.when<TWhen>(<any>ref, options);
    });
}
