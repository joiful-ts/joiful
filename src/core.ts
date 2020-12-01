import 'reflect-metadata';
import * as Joi from 'joi';

export const getJoi = (options: { joi?: typeof Joi } | undefined = {}) => options.joi || Joi;

export const WORKING_SCHEMA_KEY = 'tsdv:working-schema';
export const SCHEMA_KEY = 'tsdv:schema';
export const JOI_VERSION = getJoiVersion(Joi);

export type WorkingSchema = { [index: string]: Joi.Schema };

export interface Constructor<T> {
    new(...args: any[]): T;
}

export type AnyClass = Constructor<any>;

export type StringKey<T> = Extract<keyof T, string>;
export type StringOrSymbolKey<T> = Extract<keyof T, string | symbol>;

/**
 * If a given type extends the desired type, return the given type. Otherwise, return the desired type.
 * So, you can do stuff like this:
 *
 * ```typescript
 * interface Foo {
 *     bar: null;
 *     baz: number;
 *     boz: string;
 *     biz: string | null;
 * }
 *
 * const bars1: AllowUnions<Foo['baz'], number, Foo['baz']>[] = [
 *     'sdf', // Type 'string' is not assignable to type 'number'.
 *     null, // Type 'null' is not assignable to type 'number'.
 *     123
 * ];
 *
 * const bars2: AllowUnions<Foo['boz'], string, Foo['boz']>[] = [
 *     'sdf',
 *     null, // Type 'null' is not assignable to type 'string'.
 *     123 // Type 'number' is not assignable to type 'string'.
 * ];
 *
 * const bars3: AllowUnions<Foo['biz'], string, Foo['biz']>[] = [
 *     'sdf',
 *     null,
 *     123 // Type 'number' is not assignable to type 'string | null'.
 * ];
 * ```
 *
 * Notice that you pass the TOriginal type parameter, which is identical to the TType type parameter. This is because
 * the "extends" condition will narrow the type of TType to just TDesired. So, "string | null" will be narrowed to
 * "string", but we actually want to return the original "string | null".
 *
 * By returning the TDesired when there's no match, we get nice error messages that state what the desired type was.
 */
export type AllowUnions<TType, TDesired, TOriginal> = TType extends TDesired ? TOriginal : TDesired;

export type MapAllowUnions<TObject, TKey extends keyof TObject, TDesired> = {
    [K in TKey]: AllowUnions<TObject[K], TDesired, TObject[K]>;
};

// The default PropertyDecorator type is not very type safe, we'll use a stricter version.
export type TypedPropertyDecorator<TPropertyType> = (
    <TClass extends MapAllowUnions<TClass, TKey, TPropertyType>, TKey extends StringOrSymbolKey<TClass>>(
        target: TClass,
        propertyKey: TKey,
    ) => void
);

export function getWorkingSchema<TClass>(target: TClass): WorkingSchema | undefined {
    let workingSchema: WorkingSchema = Reflect.getOwnMetadata(WORKING_SCHEMA_KEY, target);
    return workingSchema;
}

export function getMergedWorkingSchemas(target: object): WorkingSchema | undefined {
    const parentPrototype = Object.getPrototypeOf(target);
    const parentSchema = (
        parentPrototype &&
        (parentPrototype.constructor !== Object) &&
        getMergedWorkingSchemas(parentPrototype)
    );

    const workingSchema = getWorkingSchema(target);

    if (workingSchema || parentSchema) {
        return {
            ...parentSchema,
            ...workingSchema,
        };
    }

    return undefined;
}

export function getJoiSchema(Class: AnyClass, joi: Pick<typeof Joi, 'object'>): Joi.ObjectSchema | undefined {
    const isSchemaDefined = Reflect.hasOwnMetadata(SCHEMA_KEY, Class.prototype);
    if (isSchemaDefined) {
        return Reflect.getOwnMetadata(SCHEMA_KEY, Class.prototype);
    }

    let workingSchema = getMergedWorkingSchemas(Class.prototype);
    const joiSchema: Joi.ObjectSchema | undefined = (
        workingSchema ? joi.object().keys(workingSchema) : undefined
    );
    Reflect.defineMetadata(SCHEMA_KEY, joiSchema, Class.prototype);

    return joiSchema;
}

export function updateWorkingSchema<TClass, TKey extends StringOrSymbolKey<TClass>>(
    target: TClass,
    propertyKey: TKey,
    schema: Joi.Schema,
) {
    let workingSchema = getWorkingSchema(target);
    if (!workingSchema) {
        workingSchema = {};
        Reflect.defineMetadata(WORKING_SCHEMA_KEY, workingSchema, target);
    }
    workingSchema[String(propertyKey)] = schema;
}

export interface Version {
    major: string;
    minor: string;
    patch: string;
}

export function parseVersionString(version: string) {
    const [major, minor, patch] = (version).split('.');
    return {
        major: major || '',
        minor: minor || '',
        patch: patch || '',
    };
}

export function getJoiVersion(joi: typeof Joi | undefined): Version {
    const versionString = ((joi || {}) as any)['version'] || '?.?.?';
    return parseVersionString(versionString);
}

export class IncompatibleJoiVersion extends Error {
    constructor(actualVersion: Version) {
        super(`Cannot use Joi v${actualVersion} with Joiful. Joiful requires Joi v${JOI_VERSION.major}.x.x`);
    }
}

export function checkJoiIsCompatible(joi: typeof Joi | undefined) {
    if (joi) {
        const actualVersion = getJoiVersion(joi);
        if (JOI_VERSION.major !== actualVersion.major) {
            throw new IncompatibleJoiVersion(actualVersion);
        }
    }
}
