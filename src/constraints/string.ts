import {EmailOptions, IpOptions, Reference, StringSchema, UriOptions, Schema} from "joi";
import {constraintDecorator, typeConstraintDecorator} from "../core";

export function Alphanum() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).alphanum();
    });
}

export function CreditCard() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).creditCard();
    });
}

export function Email(options? : EmailOptions) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).email(options);
    });
}

export function Guid() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).guid();
    });
}

export function Hex() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).hex();
    });
}

export function Hostname() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).hostname();
    });
}

export function Ip(options? : IpOptions) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).ip(options);
    });
}

export function IsoDate() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).isoDate();
    });
}

export function Length(limit : number | Reference, encoding? : string) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).length(<any>limit, encoding);
    });
}

export function Lowercase() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).lowercase();
    });
}

export function Max(limit : number | Reference, encoding? : string) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).max(<any>limit, encoding);
    });
}

export function Min(limit : number | Reference, encoding? : string) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).min(<any>limit, encoding);
    });
}

export function Regex(pattern : RegExp, name? : string) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).regex(pattern, name);
    });
}

export const Pattern = Regex;

export function Replace(pattern : RegExp, replacement : string) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).replace(pattern, replacement);
    });
}

export function StringSchema(schemaBuilder?: (schema: StringSchema) => StringSchema) : PropertyDecorator {
    return typeConstraintDecorator([String], (Joi) => {
        let schema = Joi.string();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function Token() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).token();
    });
}

export function Trim() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).trim();
    });
}

export function Uppercase() : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).uppercase();
    });
}

// TODO: update Joi UriOptions to support "allowRelative" option.
export function Uri(options? : UriOptions) : PropertyDecorator {
    return constraintDecorator([String], (schema : Schema) => {
        return (schema as StringSchema).uri(options);
    });
}
