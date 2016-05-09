import 'reflect-metadata';
import * as Joi from "joi";
import {allowTypes, getAndUpdateSchema, getPropertySchema, updateSchema, verifyPeers, SCHEMA_KEY, ConstraintDefinitionError} from "../core";
import {ObjectSchema, Reference, RenameOptions, Schema, SchemaMap} from "joi";

export function And(...peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.and(peers);
        });
    };
}

// NOTE: peers should really also accept a string type.
export function Assert(ref : string|Reference, schema : Schema, message? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.assert(<any>ref, schema, message);
        });
    }
}

export function Keys(schema? : SchemaMap) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.keys(schema);
        });
    }
}

export function Length(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.length(limit);
        });
    }
}

export function Max(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.max(limit);
        });
    }
}

export function Min(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.min(limit);
        });
    }
}

export function Nand(...peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.nand(peers);
        });
    }
}

export function ObjectSchema(schema? : SchemaMap) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        let schemaToCreate = getPropertySchema(target, propertyKey);
        if (schemaToCreate) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schemaToCreate = Joi.object(schema);
            updateSchema(target, propertyKey, schemaToCreate);
        }
    }
}

export function OptionalKeys(...children : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.optionalKeys(children);
        });
    }
}

export function Or(...peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.or(peers);
        });
    }
}

export function Pattern(regex : RegExp, schema : Schema) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.pattern(regex, schema);
        });
    }
}

// NOTE: peers should really also accept a string type.
export function Rename(from : string, to : string, options? : RenameOptions) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.rename(from, to, options);
        });
    }
}

export function RequiredKeys(...children : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.requiredKeys(children);
        });
    }
}

export function Type(constructor : Function, name? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.type(constructor, name);
        });
    }
}

export function Unknown(allow? : boolean) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.unknown(allow);
        });
    }
}

// NOTE: peers should really also accept a string type.
export function With(key : string, peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.with(key, peers);
        });
    }
}

// NOTE: peers should really also accept a string type.
export function Without(key : string, peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.without(key, peers);
        });
    }
}

export function Xor(...peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.xor(peers);
        });
    }
}