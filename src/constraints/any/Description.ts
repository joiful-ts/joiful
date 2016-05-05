import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Schema} from "joi";

/**
 * Annotates the key where:
 * @param desc - the description string.
 */
export function Description(desc : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : Schema) => {
            return schema.description(desc);
        });
    }
}
