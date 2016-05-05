import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {DateSchema} from "joi";
import {Reference} from "joi";

export function Max(limit : number|'now'|string|Date|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]);

        getAndUpdateSchema(target, propertyKey, (schema : DateSchema) => {
            return schema.max(<any>limit);
        });
    }
}