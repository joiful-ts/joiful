import 'reflect-metadata';
import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {ConstraintDefinitionError} from "../../core";
import {verifyPeers} from "../../core";

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