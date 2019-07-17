import { EmailOptions, IpOptions, Reference, Schema, StringSchema, UriOptions } from '@hapi/joi';
import { constraintDecorator, typeConstraintDecorator, TypedPropertyDecorator } from '../core';

type AllowedPropertyTypes = string;

export function Alphanum(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).alphanum();
    });
}

export function CreditCard(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).creditCard();
    });
}

export function Email(options?: EmailOptions): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).email(options);
    });
}

export function Guid(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).guid();
    });
}

export function Hex(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).hex();
    });
}

export function Hostname(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).hostname();
    });
}

export function Ip(options?: IpOptions): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).ip(options);
    });
}

export function IsoDate(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).isoDate();
    });
}

export function Length(limit: number | Reference, encoding?: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).length(<any>limit, encoding);
    });
}

export function Lowercase(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).lowercase();
    });
}

export function Max(limit: number | Reference, encoding?: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).max(<any>limit, encoding);
    });
}

export function Min(limit: number | Reference, encoding?: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).min(<any>limit, encoding);
    });
}

export function Regex(pattern: RegExp, name?: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).regex(pattern, name);
    });
}

export const Pattern = Regex;

export function Replace(pattern: RegExp, replacement: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).replace(pattern, replacement);
    });
}

export function StringSchema(
    schemaBuilder?: (schema: StringSchema) => StringSchema,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator<AllowedPropertyTypes>((Joi) => {
        let schema = Joi.string();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function Token(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).token();
    });
}

export function Trim(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).trim();
    });
}

export function Uppercase(): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).uppercase();
    });
}

// TODO: update Joi UriOptions to support "allowRelative" option.
export function Uri(options?: UriOptions): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as StringSchema).uri(options);
    });
}
