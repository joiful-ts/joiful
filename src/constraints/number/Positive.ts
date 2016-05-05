import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Reference} from "joi";
import {NumberSchema} from "joi";

export function Positive() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.positive();
        });
    }
}