import "reflect-metadata";
import {Schema, ObjectSchema} from "joi";
import JoiModule = require("joi");

export const SCHEMA_KEY = "tsdv:schema";
export let Joi : typeof JoiModule; // TODO: proper interface

export function registerJoi(joi : any) {
    Joi = joi;
}

export class ConstraintDefinitionError extends Error {
    name = "ConstraintDefinitionError";

    constructor(public message : string) {
        super(message);

        (<any> Object).setPrototypeOf(this, ConstraintDefinitionError.prototype);
    }
}

export type WorkingSchema = { [index : string] : Schema };

export function getClassSchema(target : Object) : WorkingSchema {
    let classSchema : WorkingSchema = Reflect.getMetadata(SCHEMA_KEY, target);
    if (!classSchema) {
        classSchema = {};
        Reflect.defineMetadata(SCHEMA_KEY, classSchema, target);
    }
    return classSchema;
}

export function getJoiSchema(clz : Function) : ObjectSchema {
    let classSchema : any = Reflect.getMetadata(SCHEMA_KEY, clz.prototype);
    if (!classSchema['isJoi']) {
        classSchema = Joi.object().keys(classSchema);
        Reflect.defineMetadata(SCHEMA_KEY, classSchema, clz.prototype);
    }
    return <ObjectSchema> classSchema;
}

export function getPropertySchema(target : Object, propertyKey : string | symbol) {
    const classSchema = getClassSchema(target);
    return classSchema[propertyKey];
}

export function updateSchema(target : Object, propertyKey : string | symbol, schema : Schema) {
    const classSchema = getClassSchema(target);
    classSchema[propertyKey] = schema;
}

export function getAndUpdateSchema(target : Object, propertyKey : string | symbol, updateFunction : (schema : Schema) => Schema) {
    let schema = getPropertySchema(target, propertyKey);
    if (!schema) {
        schema = guessTypeSchema(target, propertyKey);
    }
    schema = updateFunction(schema);
    updateSchema(target, propertyKey, schema);
}

export function constraintDecorator(allowedTypes : Function[], updateFunction : (schema : Schema) => Schema) : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        allowTypes(target, propertyKey, allowedTypes);
        getAndUpdateSchema(target, propertyKey, updateFunction);
    };
}

export function constraintDecoratorWithPeers(allowedTypes : Function[], peers : string[], updateFunction : (schema : Schema) => Schema) : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        allowTypes(target, propertyKey, allowedTypes);
        verifyPeers(target, peers);
        getAndUpdateSchema(target, propertyKey, updateFunction);
    };
}

export function typeConstraintDecorator(allowedTypes : Function[], typeSchema : (Joi : typeof JoiModule) => Schema) {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, allowedTypes);

        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schema = typeSchema(Joi);
            updateSchema(target, propertyKey, schema);
        }
    }
}

function guessTypeSchema(target : Object, propertyKey : string | symbol) : Schema{
    let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
    let schema : Schema | undefined = undefined;
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
            schema = Joi.object();
            break;
        case String:
            schema = Joi.string();
            break;
        default:
            break;
    }
    if (schema === undefined) {
        throw new ConstraintDefinitionError(`No validation schema exists, nor could it be derived, for property "${propertyKey}". Please decorate the property with a type schema.`);
    }
    return schema;
}

/**
 * @param target
 * @param propertyKey
 * @param types - the constructors for allowed classes. If empty, all types are allowed.
 */
export function allowTypes(target : any, propertyKey : string | symbol, types : Function[]) {
    if (types && types.length > 0) {
        const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        if (types.indexOf(propertyType) == -1) {
            throw new ConstraintDefinitionError(`Constrained property "${ propertyKey }" has an unsupported type. Wanted ${ types.map((t) => '"' + (<any> t).name + '"').join(' or ') }, found "${ propertyType.name }"`);
        }
    }
}

export function verifyPeers(target : Object, peers : string[]) {
    // Verify that the properties actually exist on the class.
    let notFound : string[] = [];
    for (let peer of peers) {
        let type = Reflect.getMetadata("design:type", target, peer);
        console.log(type);
        if (type === undefined) {
            notFound.push(peer);

        }
    }
    if (notFound.length > 0) {
        let peersString = notFound.map((v : string) => `"${ v }"`).join(', ');
        let msg : string;
        if (notFound.length == 1) {
            msg = `Peer/property ${ peersString } does not exist.`;
        } else {
            msg = `Peers/properties ${ peersString } do not exist.`;
        }
        throw new ConstraintDefinitionError(msg);
    }
}