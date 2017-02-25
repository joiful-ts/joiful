import {EmailOptions, IpOptions, Reference, StringSchema, UriOptions, Schema} from "joi";
import {constraintDecorator, typeConstraintDecorator} from "../core";

export namespace StringConstraints {
    export function Alphanum() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.alphanum();
        });
    }

    export function CreditCard() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.creditCard();
        });
    }

    export function Email(options? : EmailOptions) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.email(options);
        });
    }

    export function Guid() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.guid();
        });
    }

    export function Hex() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.hex();
        });
    }

    export function Hostname() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.hostname();
        });
    }

    export function Ip(options? : IpOptions) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.ip(options);
        });
    }

    export function IsoDate() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.isoDate();
        });
    }

    export function Length(limit : number | Reference, encoding? : string) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.length(<any>limit, encoding);
        });
    }

    export function Lowercase() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.lowercase();
        });
    }

    export function Max(limit : number | Reference, encoding? : string) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.max(<any>limit, encoding);
        });
    }

    export function Min(limit : number | Reference, encoding? : string) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.min(<any>limit, encoding);
        });
    }

    export function Regex(pattern : RegExp, name? : string) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.regex(pattern, name);
        });
    }

    export const Pattern = Regex;

    export function Replace(pattern : RegExp, replacement : string) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.replace(pattern, replacement);
        });
    }

    export function StringSchema() : PropertyDecorator {
        return typeConstraintDecorator([String], (Joi) => {
            return <Schema> Joi.string();
        });
    }

    export function Token() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.token();
        });
    }

    export function Trim() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.trim();
        });
    }

    export function Uppercase() : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.uppercase();
        });
    }

// TODO: update Joi UriOptions to support "allowRelative" option.
    export function Uri(options? : UriOptions) : PropertyDecorator {
        return constraintDecorator([String], (schema : StringSchema) => {
            return schema.uri(options);
        });
    }
}