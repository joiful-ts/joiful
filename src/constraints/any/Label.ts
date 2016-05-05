import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Schema} from "joi";

/**
 * Overrides the key name in error messages.
 */
export function Label(name : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : Schema) => {
            return schema.label(name);
        });
    }
}
