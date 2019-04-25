import {ObjectSchema, Reference, RenameOptions, Schema, SchemaMap} from "joi";
import {
    constraintDecorator,
    constraintDecoratorWithPeers,
    StringOrSymbolKey,
    typeConstraintDecorator,
    TypedPropertyDecorator
} from "../core";

export function And<TClass, TKey extends StringOrSymbolKey<TClass>>(peer : StringOrSymbolKey<TClass>, ...peers : StringOrSymbolKey<TClass>[]) : TypedPropertyDecorator<TClass, TKey> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers<object, TClass, TKey>(peers, (schema : Schema) => {
        return (schema as ObjectSchema).and(peers as string[]);
    });
}

export function Assert<TClass, TKey extends StringOrSymbolKey<TClass>>(ref : string | Reference, schema : Schema, message? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<object, TClass, TKey>((schemaToUpdate : Schema) => {
        return (schemaToUpdate as ObjectSchema).assert(<any>ref, schema, message);
    });
}

export type KeysSchemaMap<TClass> = { [P in keyof TClass]: Schema | SchemaMap | (Schema | SchemaMap)[] };

export function Keys<TClass, TKey extends StringOrSymbolKey<TClass>>(schema? : KeysSchemaMap<TClass>) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator<object, TClass, TKey>((schemaToUpdate : Schema) => {
        return (schemaToUpdate as ObjectSchema).keys(schema);
    });
}

export function Length<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).length(limit);
    });
}

export function Max<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).max(limit);
    });
}

export function Min<TClass, TKey extends StringOrSymbolKey<TClass>>(limit : number) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).min(limit);
    });
}

export function Nand<TClass, TKey extends StringOrSymbolKey<TClass>>(peer : StringOrSymbolKey<TClass>, ...peers : StringOrSymbolKey<TClass>[]) : TypedPropertyDecorator<TClass, TKey> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers(peers, (schema : Schema) => {
        return (schema as ObjectSchema).nand(peers as string[]);
    });
}

export function ObjectSchema<TClass, TKey extends StringOrSymbolKey<TClass>>(schema? : SchemaMap) : TypedPropertyDecorator<TClass, TKey> {
    return typeConstraintDecorator((Joi) => {
        return Joi.object(schema);
    });
}

export function OptionalKeys<TClass, TKey extends StringOrSymbolKey<TClass>>(...children : (keyof TClass & string)[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).optionalKeys(children as string[]);
    });
}

export function Or<TClass, TKey extends StringOrSymbolKey<TClass>>(peer : StringOrSymbolKey<TClass>, ...peers : StringOrSymbolKey<TClass>[]) : TypedPropertyDecorator<TClass, TKey> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers(peers, (schema : Schema) => {
        return (schema as ObjectSchema).or(peers as string[]);
    });
}

export function Pattern<TClass, TKey extends StringOrSymbolKey<TClass>>(regex : RegExp, schema : Schema) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((objSchema : Schema) => {
        return (objSchema as ObjectSchema).pattern(regex, schema);
    });
}

export function Rename<TClass, TKey extends StringOrSymbolKey<TClass>>(from : string, to : string, options? : RenameOptions) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).rename(from, to, options);
    });
}

export function RequiredKeys<TClass, TKey extends StringOrSymbolKey<TClass>>(...children : (keyof TClass & string)[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).requiredKeys(children as string[]);
    });
}

export function Type<TClass, TKey extends StringOrSymbolKey<TClass>>(constructor : Function, name? : string) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).type(constructor, name);
    });
}

export function Unknown<TClass, TKey extends StringOrSymbolKey<TClass>>(allow? : boolean) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecorator((schema : Schema) => {
        return (schema as ObjectSchema).unknown(allow);
    });
}

export function With<TClass, TKey extends StringOrSymbolKey<TClass>>(key : StringOrSymbolKey<TClass>, peers : (StringOrSymbolKey<TClass>)[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecoratorWithPeers(peers, (schema : Schema) => {
        return (schema as ObjectSchema).with(key as string, peers as string[]);
    });
}

export function Without<TClass, TKey extends StringOrSymbolKey<TClass>>(key : StringOrSymbolKey<TClass>, peers : (StringOrSymbolKey<TClass>)[]) : TypedPropertyDecorator<TClass, TKey> {
    return constraintDecoratorWithPeers(peers, (schema : Schema) => {
        return (schema as ObjectSchema).without(key as string, peers as string[]);
    });
}

export function Xor<TClass, TKey extends StringOrSymbolKey<TClass>>(peer : StringOrSymbolKey<TClass>, ...peers : StringOrSymbolKey<TClass>[]) : TypedPropertyDecorator<TClass, TKey> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers(peers, (schema : Schema) => {
        return (schema as ObjectSchema).xor(peers as string[]);
    });
}
