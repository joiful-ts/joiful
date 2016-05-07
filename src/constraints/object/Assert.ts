import 'reflect-metadata';
import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {Reference} from "joi";
import {Schema} from "joi";

// NOTE: peers should really also accept a string type.
export function Assert(ref : string|Reference, schema : Schema, message? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.assert(<any>ref, schema, message);
        });
    }
}