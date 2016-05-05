import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ArraySchema} from "joi";

/**
 * Requires the array values to be unique.
 */
export function Unique() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.unique();
        });
    }
}
