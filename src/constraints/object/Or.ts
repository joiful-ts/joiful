import 'reflect-metadata';
import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {ConstraintDefinitionError} from "../../core";
import {verifyPeers} from "../../core";

export function Or(...peers : string[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        verifyPeers(target, peers);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.or(peers);
        });
    }
}