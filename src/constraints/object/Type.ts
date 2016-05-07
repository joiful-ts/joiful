import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {Schema} from "joi";

export function Type(constructor : Function, name? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schema : ObjectSchema) => {
            return schema.type(constructor, name);
        });
    }
}