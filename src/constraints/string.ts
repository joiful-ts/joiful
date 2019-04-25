import {EmailOptions, IpOptions, Reference, StringSchema, UriOptions, Schema} from "joi";
import {constraintDecorator, StringOrSymbolKey, typeConstraintDecorator, TypedPropertyDecorator} from "../core";

type AllowedPropertyTypes = string;

export function Alphanum<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).alphanum();
    });
}

export function CreditCard<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).creditCard();
    });
}

export function Email<TClass, TKey extends StringOrSymbolKey<TClass>>(options? : EmailOptions) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).email(options);
    });
}

export function Guid<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).guid();
    });
}

export function Hex<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).hex();
    });
}

export function Hostname<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).hostname();
    });
}

export function Ip<TClass, TKey extends StringOrSymbolKey<TClass>>(options? : IpOptions) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).ip(options);
    });
}

export function IsoDate<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).isoDate();
    });
}

export function Length<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference, encoding? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).length(<any>limit, encoding);
    });
}

export function Lowercase<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).lowercase();
    });
}

export function Max<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference, encoding? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).max(<any>limit, encoding);
    });
}

export function Min<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number | Reference, encoding? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).min(<any>limit, encoding);
    });
}

export function Regex<TClass, TKey extends StringOrSymbolKey<TClass>>(pattern : RegExp, name? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).regex(pattern, name);
    });
}

export const Pattern = Regex;

export function Replace<TClass, TKey extends StringOrSymbolKey<TClass>>(pattern : RegExp, replacement : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).replace(pattern, replacement);
    });
}

export function StringSchema<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator<AllowedPropertyTypes, TClass, TKey>((Joi) => {
        return <Schema> Joi.string();
    });
}

export function Token<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).token();
    });
}

export function Trim<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).trim();
    });
}

export function Uppercase<TClass, TKey extends StringOrSymbolKey<TClass>>() : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).uppercase();
    });
}

// TODO: update Joi UriOptions to support "allowRelative" option.
export function Uri<TClass, TKey extends StringOrSymbolKey<TClass>>(options? : UriOptions) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<AllowedPropertyTypes, TClass, TKey>((schema : Schema) => {
        return (schema as StringSchema).uri(options);
    });
}
