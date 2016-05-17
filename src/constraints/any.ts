import {Reference} from "joi";
import {Schema} from "joi";
import {ValidationOptions} from "joi";
import {WhenOptions} from "joi";
import {constraintDecorator} from "../core";
import {typeConstraintDecorator} from "../core";

export function Allow(...values : any[]) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.allow(values);
    });
}

export function AnySchema() : PropertyDecorator {
    return typeConstraintDecorator([Number], (Joi : { any : () => Schema }) => {
        return Joi.any();
    });
}

/**
 * Returns a new type that is the result of adding the rules of one type to another.
 */
export function Concat(schema : Schema) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.concat(schema);
    });
}

/**
 * Sets a default value if the original value is undefined.
 */
export function Default(value? : any, description? : string) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.default(value, description);
    });
}

/**
 * Annotates the key where:
 * @param desc - the description string.
 */
export function Description(desc : string) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.description(desc);
    });
}

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Empty(schema : any) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.empty(schema);
    });
}

/**
 * Annotates the key where:
 * @param value - an example value.
 * If the example fails to pass validation, the function will throw.
 */
export function Example(value : any) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.example(value);
    });
}

/**
 * Marks a key as forbidden which will not allow any value except undefined. Used to explicitly forbid keys.
 */
export function Forbidden() : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.forbidden();
    });
}

export function Invalid(...values : any[]) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.invalid(values);
    });
}

export const Disallow = Invalid;

export const Not = Invalid;

/**
 * Overrides the key name in error messages.
 */
export function Label(name : string) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.label(name);
    });
}

/**
 * Attaches metadata to the key where:
 * @param meta - the meta object to attach.
 */
export function Meta(meta : any) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.meta(meta);
    });
}

/**
 * Annotates the key where:
 * @param notes - the notes string or multiple strings.
 */
export function Notes(...notes : string[]) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.notes(notes);
    });
}

export function Optional() : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.optional();
    });
}

/**
 * Overrides the global validate() options for the current key and any sub-key where:
 * @param options - an object with the same optional keys as Joi.validate(value, schema, options, callback).
 */
export function Options(options : ValidationOptions) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.options(options);
    });
}

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Raw(isRaw? : boolean) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.raw(isRaw);
    });
}

export function Required() : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.required();
    });
}

/**
 * Strict mode sets the options.convert options to false which prevent type casting for the current key and any child keys.
 * @param isStrict - whether strict mode is enabled or not. Defaults to true.
 */
export function Strict(isStrict? : boolean) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.strict(isStrict);
    });
}

/**
 * Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
 */
export function Strip() : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.strip();
    });
}

/**
 * Annotates the key where:
 * @param tags - the tag string or multiple strings.
 */
export function Tags(...tags : string[]) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.tags(tags);
    });
}

/**
 * Annotates the key where:
 * @param name - the unit name of the value.
 */
export function Unit(name : string) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.unit(name);
    });
}

export function Valid(...values : any[]) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.valid(values);
    });
}

export const Only = Valid;

export const Equal = Valid;

/**
 * Converts the type into an alternatives type where the conditions are merged into the type definition.
 */
export function When<T>(ref : string|Reference, options : WhenOptions<T>) : PropertyDecorator {
    return constraintDecorator([], (schema : Schema) => {
        return schema.when<T>(<any>ref, options);
    });
}
