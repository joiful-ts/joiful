import {ObjectSchema, Reference, RenameOptions, Schema, SchemaMap} from "joi";
import {constraintDecorator, constraintDecoratorWithPeers, typeConstraintDecorator} from "../core";

export namespace ObjectConstraints {
    export function And<TClass>(peer : keyof TClass, ...peers : (keyof TClass)[]) : PropertyDecorator {
        peers = [peer].concat(peers);
        return constraintDecoratorWithPeers([Object], peers, (schema : Schema) => {
            return (schema as ObjectSchema).and(peers as string[]);
        });
    }

    export function Assert(ref : string | Reference, schema : Schema, message? : string) : PropertyDecorator {
        return constraintDecorator([Object], (schemaToUpdate : Schema) => {
            return (schemaToUpdate as ObjectSchema).assert(<any>ref, schema, message);
        });
    }

    export function Keys(schema? : SchemaMap) : PropertyDecorator {
        return constraintDecorator([Object], (schemaToUpdate : Schema) => {
            return (schemaToUpdate as ObjectSchema).keys(schema);
        });
    }

    export function Length(limit : number) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).length(limit);
        });
    }

    export function Max(limit : number) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).max(limit);
        });
    }

    export function Min(limit : number) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).min(limit);
        });
    }

    export function Nand<TClass>(peer : keyof TClass, ...peers : (keyof TClass)[]) : PropertyDecorator {
        peers = [peer].concat(peers);
        return constraintDecoratorWithPeers([Object], peers, (schema : Schema) => {
            return (schema as ObjectSchema).nand(peers as string[]);
        });
    }

    export function ObjectSchema(schema? : SchemaMap) : PropertyDecorator {
        return typeConstraintDecorator([Object], (Joi) => {
            return Joi.object(schema);
        });
    }

    export function OptionalKeys<TClass>(...children : (keyof TClass)[]) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).optionalKeys(children as string[]);
        });
    }

    export function Or<TClass>(peer : keyof TClass, ...peers : (keyof TClass)[]) : PropertyDecorator {
        peers = [peer].concat(peers);
        return constraintDecoratorWithPeers([Object], peers, (schema : Schema) => {
            return (schema as ObjectSchema).or(peers as string[]);
        });
    }

    export function Pattern(regex : RegExp, schema : Schema) : PropertyDecorator {
        return constraintDecorator([Object], (objSchema : Schema) => {
            return (objSchema as ObjectSchema).pattern(regex, schema);
        });
    }

// NOTE: peers should really also accept a string type.
    export function Rename(from : string, to : string, options? : RenameOptions) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).rename(from, to, options);
        });
    }

    export function RequiredKeys<TClass>(...children : (keyof TClass)[]) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).requiredKeys(children as string[]);
        });
    }

    export function Type(constructor : Function, name? : string) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).type(constructor, name);
        });
    }

    export function Unknown(allow? : boolean) : PropertyDecorator {
        return constraintDecorator([Object], (schema : Schema) => {
            return (schema as ObjectSchema).unknown(allow);
        });
    }

    export function With<TClass>(key : keyof TClass, peers : (keyof TClass)[]) : PropertyDecorator {
        return constraintDecoratorWithPeers([Object], peers, (schema : Schema) => {
            return (schema as ObjectSchema).with(key as string, peers as string[]);
        });
    }

    export function Without<TClass>(key : keyof TClass, peers : (keyof TClass)[]) : PropertyDecorator {
        return constraintDecoratorWithPeers([Object], peers, (schema : Schema) => {
            return (schema as ObjectSchema).without(key as string, peers as string[]);
        });
    }

    export function Xor<TClass>(peer : keyof TClass, ...peers : (keyof TClass)[]) : PropertyDecorator {
        peers = [peer].concat(peers);
        return constraintDecoratorWithPeers([Object], peers, (schema : Schema) => {
            return (schema as ObjectSchema).xor(peers as string[]);
        });
    }
}
