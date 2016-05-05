import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";

// TODO: support binary (Buffer)
export function Max(limit : number, encoding? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Array, Number, Object, String]);

        getAndUpdateSchema(target, propertyKey, (schema) => {
            return schema.max(limit, encoding);
        });
    }
}