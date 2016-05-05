import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ArraySchema} from "joi";
import {Schema} from "joi";

/**
 * List the types allowed for the array values.
 */
export function Items(...type : Schema[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.items(type);
        });
    }
}
