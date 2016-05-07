import 'reflect-metadata';
import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {RenameOptions} from "joi";

// NOTE: peers should really also accept a string type.
export function Rename(from : string, to : string, options? : RenameOptions) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.rename(from, to, options);
        });
    }
}