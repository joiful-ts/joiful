import 'reflect-metadata';
export const SCHEMA_KEY = "tsdv:schema";
import {Schema} from "joi";

export var Joi : any; // TODO: proper interface

export function registerJoi(joi : any) {
    Joi = joi;
}

export class ConstraintDefinitionError extends Error {
    name = "ConstraintDefinitionError";

    constructor(public message : string) {
        super(message);
    }
}

export function getClassSchema(target : Object) : { [index : string] : any } {
    var classSchema : { [index : string] : any } = Reflect.getMetadata(SCHEMA_KEY, target);
    if (!classSchema) {
        classSchema = {};
        Reflect.defineMetadata(SCHEMA_KEY, classSchema, target);
    }
    return classSchema;
}

export function getPropertySchema(target : Object, propertyKey : string|symbol) {
    var classSchema = getClassSchema(target);
    return classSchema[propertyKey];
}

export function updateSchema(target : Object, propertyKey : string|symbol, schema : any) {
    var classSchema = getClassSchema(target);
    classSchema[propertyKey] = schema;
}

export function getAndUpdateSchema(target : Object, propertyKey : string|symbol, updateFunction : (schema : any) => any) {
    let schema = getPropertySchema(target, propertyKey);
    if (!schema) {
        schema = guessTypeSchema(target, propertyKey);
    }
    schema = updateFunction(schema);
    updateSchema(target, propertyKey, schema);
}

export function constraintDecorator(allowedTypes : Function[], updateFunction : (schema : any) => any) : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        allowTypes(target, propertyKey, allowedTypes);
        getAndUpdateSchema(target, propertyKey, updateFunction);
    };
}

export function constraintDecoratorWithPeers(allowedTypes : Function[], peers : string[], updateFunction : (schema : any) => any) : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        allowTypes(target, propertyKey, allowedTypes);
        verifyPeers(target, peers);
        getAndUpdateSchema(target, propertyKey, updateFunction);
    };
}

export function typeConstraintDecorator(allowedTypes : Function[], typeSchema : (Joi : any) => Schema) {
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

function guessTypeSchema(target : Object, propertyKey : string|symbol) {
    let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
    let schema : Schema = null;
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
    if (schema === null) {
        throw new ConstraintDefinitionError(`No validation schema exists, nor could it be derived, for property "${propertyKey}". Please decorate the property with a type schema.`);
    }
    return schema;
}

/**
 * @param target
 * @param propertyKey
 * @param types - the constructors for allowed classes. If empty, all types are allowed.
 */
export function allowTypes(target : any, propertyKey : string|symbol, types : Function[]) {
    if (types && types.length > 0) {
        let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        if (types.indexOf(propertyType) == -1) {
            throw new ConstraintDefinitionError(`Constraint is not supported on property's type: ${propertyKey}`);
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