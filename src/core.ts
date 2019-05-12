import { Schema, ObjectSchema } from "joi";
import * as joi from "joi";

export const WORKING_SCHEMA_KEY = "tsdv:working-schema";
export const SCHEMA_KEY = "tsdv:schema";
export let Joi = joi;

export function registerJoi(customJoi: typeof joi) {
    Joi = customJoi;
}

export class ConstraintDefinitionError extends Error {
    name = "ConstraintDefinitionError";

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, ConstraintDefinitionError.prototype);
    }
}

export class ValidationSchemaNotFound extends ConstraintDefinitionError {
    name = "ValidationSchemaNotFound";

    constructor(propertyKey: string | Symbol) {
        super(
            `No validation schema exists, nor could it be inferred from the design:type metadata, ` +
            `for property "${String(propertyKey)}". Please decorate the property with a type schema.`
        );
    }
}

export type WorkingSchema = { [index: string]: Schema };

export interface AnyClass {
    new(...args: any[]): any;
}

export type StringKey<T> = Extract<keyof T, string>;
export type StringOrSymbolKey<T> = Extract<keyof T, string | symbol>;

export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

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
export type TypedPropertyDecorator<TPropertyType> = <TClass extends MapAllowUnions<TClass, TKey, TPropertyType>, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey) => void;

function getDesignType<TClass, TKey extends StringOrSymbolKey<TClass>>(target: TClass, targetKey: TKey): any {
    return Reflect.getMetadata("design:type", target, String(targetKey));
}

export function getWorkingSchema<TClass>(target: TClass): WorkingSchema {
    let workingSchema: WorkingSchema = Reflect.getOwnMetadata(WORKING_SCHEMA_KEY, target);
    if (!workingSchema) {
        workingSchema = {};
        Reflect.defineMetadata(WORKING_SCHEMA_KEY, workingSchema, target);
    }
    return workingSchema;
}

export function getMergedWorkingSchemas(target: object): WorkingSchema {
    const workingSchema = {};
    const parentPrototype = Object.getPrototypeOf(target);
    if (!!(parentPrototype && parentPrototype.constructor !== Object)) {
        Object.assign(workingSchema, getMergedWorkingSchemas(parentPrototype));
    }
    Object.assign(workingSchema, getWorkingSchema(target));
    return workingSchema;
}

export function getJoiSchema(clz: AnyClass): ObjectSchema {
    let joiSchema: ObjectSchema | undefined = Reflect.getOwnMetadata(SCHEMA_KEY, clz.prototype);
    if (joiSchema) {
        return joiSchema;
    } else {
        let workingSchema: WorkingSchema = getMergedWorkingSchemas(clz.prototype);
        if (!workingSchema) {
            throw new ConstraintDefinitionError(`Class "${(clz && (<any>clz).name) ? (<any>clz).name : clz}" doesn't have a schema. You may need to manually specify the base type schema, set the property type to a class, or use "Any()".`);
        }
        joiSchema = Joi.object().keys(workingSchema);
        Reflect.defineMetadata(SCHEMA_KEY, joiSchema, clz.prototype);
        return joiSchema;
    }
}

export function getPropertySchema<TClass, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey) {
    const classSchema = getWorkingSchema(target);
    return classSchema[String(propertyKey)];
}

export function updateSchema<TClass, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey, schema: Schema) {
    const classSchema = getWorkingSchema(target);
    classSchema[String(propertyKey)] = schema;
}

export function getAndUpdateSchema<TClass, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey, updateFunction: (schema: Schema) => Schema) {
    let schema = getPropertySchema(target, propertyKey);
    if (!schema) {
        schema = guessTypeSchema(target, propertyKey);
    }
    schema = updateFunction(schema);
    updateSchema(target, propertyKey, schema);
}

export function constraintDecorator<
    TPropertyType
>(updateFunction: (schema: Schema) => Schema): TypedPropertyDecorator<TPropertyType> {
    return function <TClass extends MapAllowUnions<TClass, TKey, TPropertyType>, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey) {
        getAndUpdateSchema(target, propertyKey, updateFunction);
    };
}

export function constraintDecoratorWithPeers<
    TPropertyType,
    TClassForPeers,
    >(peers: StringOrSymbolKey<TClassForPeers>[], updateFunction: (schema: Schema) => Schema): TypedPropertyDecorator<TPropertyType> {
    return function <TClass extends MapAllowUnions<TClass, TKey, TPropertyType>, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey) {
        verifyPeers(target as unknown as TClassForPeers, peers); // TODO: fix this dodgy cast
        getAndUpdateSchema(target, propertyKey, updateFunction);
    };
}

export function typeConstraintDecorator<
    TPropertyType,
    >(typeSchema: (Joi: typeof joi) => Schema) {
    return function <TClass extends MapAllowUnions<TClass, TKey, TPropertyType>, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey): void {
        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${String(propertyKey)}`);
        } else {
            schema = typeSchema(Joi);
            updateSchema(target, propertyKey, schema);
        }
    }
}

function guessTypeSchema<TClass, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey): Schema {
    let propertyType = getDesignType(target, propertyKey);
    let schema: Schema | undefined = undefined;
    switch (propertyType) {
        case Array:
            schema = Joi.array();
            break;
        case Boolean:
            schema = Joi.boolean();
            break;
        case Date:
            schema = Joi.date();
            break;
        case Function:
            schema = Joi.func();
            break;
        case Number:
            schema = Joi.number();
            break;
        case Object:
            // We don't guess the type for "Object" types, because these can represent unions like "number | null".
            // To use an object schema, you must explicitly decorate the property with ObjectSchema().
            // schema = Joi.object();
            break;
        case String:
            schema = Joi.string();
            break;
        default:
            break;
    }
    if (schema === undefined) {
        throw new ValidationSchemaNotFound(propertyKey);
    }
    return schema;
}

function looksLikeAClass(somethingClassy: Function) {
    return (
        somethingClassy.toString().lastIndexOf('class ', 0) === 0 // Easy check for ES6 classes
        || ( // Otherwise, let's use some heuristics
            somethingClassy !== Function // Don't allow regular functions.
            && somethingClassy instanceof Function // All classes extend Function.
            && !somethingClassy.name // Anonymous functions don't have a name.
            && somethingClassy.prototype !== undefined // Functions usually don't have a prototype.
            && somethingClassy.prototype.constructor === somethingClassy // A class's (prototype) constructor should be the same as the function passed in.
        )
    );
}

/**
 * @param target
 * @param propertyKey
 * @param types - the constructors for allowed classes. If empty, all types are allowed. Note that "Object" is always allowed, to support union types like "number | null".
 */
export function allowTypes(target: any, propertyKey: string | symbol, types: Function[]) {
    if (types && types.length > 0) {
        const propertyType = getDesignType(target, propertyKey);
        if (propertyType !== Object && types.indexOf(propertyType) === -1) {
            for (const allowedType of types) {
                if (allowedType === Object && looksLikeAClass(propertyType)) {
                    // Class instances extend Function, but can be considered "objects".
                    return;
                }
            }
            throw new ConstraintDefinitionError(`Constrained property "${String(propertyKey)}" has an unsupported type. Wanted ${types.map((t) => `"${t.name}"`).join(' or ')}, found "${propertyType ? propertyType.name : propertyType}"`);
        }
    }
}

export function verifyPeers<TClass>(target: TClass, peers: StringOrSymbolKey<TClass>[]) {
    // Verify that the properties actually exist on the class.
    let notFound: StringOrSymbolKey<TClass>[] = [];
    for (let peer of peers) {
        let type = getDesignType(target, peer);
        if (type === undefined) {
            notFound.push(peer);

        }
    }
    if (notFound.length > 0) {
        let peersString = notFound.map((v: string | symbol) => `"${String(v)}"`).join(', ');
        let msg: string;
        if (notFound.length == 1) {
            msg = `Peer/property ${peersString} does not exist.`;
        } else {
            msg = `Peers/properties ${peersString} do not exist.`;
        }
        throw new ConstraintDefinitionError(msg);
    }
}
