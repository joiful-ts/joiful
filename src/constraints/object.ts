import { ObjectSchema, Reference, RenameOptions, Schema, SchemaMap } from '@hapi/joi';
import {
    constraintDecorator,
    constraintDecoratorWithPeers,
    StringOrSymbolKey,
    typeConstraintDecorator,
    TypedPropertyDecorator,
} from '../core';

type AllowedPropertyTypes = object;

export function And<TClass>(
    peer: StringOrSymbolKey<TClass>,
    ...peers: StringOrSymbolKey<TClass>[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers<AllowedPropertyTypes, TClass>(peers, (schema: Schema) => {
        return (schema as ObjectSchema).and(peers as string[]);
    });
}

export function Assert(
    ref: string | Reference,
    schema: Schema,
    message?: string,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schemaToUpdate: Schema) => {
        return (schemaToUpdate as ObjectSchema).assert(<any>ref, schema, message);
    });
}

export type KeysSchemaMap<TClass> = { [P in keyof TClass]: Schema | SchemaMap | (Schema | SchemaMap)[] };

export function Keys<TClass>(schema?: KeysSchemaMap<TClass>): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schemaToUpdate: Schema) => {
        return (schemaToUpdate as ObjectSchema).keys(schema);
    });
}

export function Length(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).length(limit);
    });
}

export function Max(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).max(limit);
    });
}

export function Min(limit: number): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).min(limit);
    });
}

export function Nand<TClass>(
    peer: StringOrSymbolKey<TClass>,
    ...peers: StringOrSymbolKey<TClass>[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers<AllowedPropertyTypes, TClass>(peers, (schema: Schema) => {
        return (schema as ObjectSchema).nand(peers as string[]);
    });
}

export function ObjectSchema(schema?: SchemaMap): TypedPropertyDecorator<AllowedPropertyTypes> {
    return typeConstraintDecorator((Joi) => {
        return Joi.object(schema);
    });
}

export function OptionalKeys<TClass>(
    ...children: (keyof TClass & string)[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).optionalKeys(children as string[]);
    });
}

export function Or<TClass>(
    peer: StringOrSymbolKey<TClass>,
    ...peers: StringOrSymbolKey<TClass>[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers<AllowedPropertyTypes, TClass>(peers, (schema: Schema) => {
        return (schema as ObjectSchema).or(peers as string[]);
    });
}

export function Pattern(regex: RegExp, schema: Schema): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((objSchema: Schema) => {
        return (objSchema as ObjectSchema).pattern(regex, schema);
    });
}

export function Rename(
    from: string,
    to: string,
    options?: RenameOptions,
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).rename(from, to, options);
    });
}

export function RequiredKeys<TClass>(
    ...children: (StringOrSymbolKey<TClass>)[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).requiredKeys(children as string[]);
    });
}

export function Type(constructor: Function, name?: string): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).type(constructor, name);
    });
}

export function Unknown(allow?: boolean): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecorator<AllowedPropertyTypes>((schema: Schema) => {
        return (schema as ObjectSchema).unknown(allow);
    });
}

export function With<TClass>(
    key: StringOrSymbolKey<TClass>,
    peers: (StringOrSymbolKey<TClass>)[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecoratorWithPeers<AllowedPropertyTypes, TClass>(peers, (schema: Schema) => {
        return (schema as ObjectSchema).with(key as string, peers as string[]);
    });
}

export function Without<TClass>(
    key: StringOrSymbolKey<TClass>,
    peers: (StringOrSymbolKey<TClass>)[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    return constraintDecoratorWithPeers<AllowedPropertyTypes, TClass>(peers, (schema: Schema) => {
        return (schema as ObjectSchema).without(key as string, peers as string[]);
    });
}

export function Xor<TClass>(
    peer: StringOrSymbolKey<TClass>,
    ...peers: StringOrSymbolKey<TClass>[] // tslint:disable-line: trailing-comma
): TypedPropertyDecorator<AllowedPropertyTypes> {
    peers = [peer].concat(peers);
    return constraintDecoratorWithPeers<AllowedPropertyTypes, TClass>(peers, (schema: Schema) => {
        return (schema as ObjectSchema).xor(peers as string[]);
    });
}
