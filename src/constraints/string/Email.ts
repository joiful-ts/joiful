import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {StringSchema} from "joi";
import {EmailOptions} from "joi";

export function Email(options : EmailOptions) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [String]);

        getAndUpdateSchema(target, propertyKey, (schema : StringSchema) => {
            return schema.email(options);
        });
    }
}