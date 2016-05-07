import 'reflect-metadata';
import * as Joi from "joi";
import {allowTypes, getAndUpdateSchema, verifyPeers} from "../../core";
import {ObjectSchema} from "joi";
import {ConstraintDefinitionError} from "../../core";

export function And(...peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.and(peers);
        });
    }
}