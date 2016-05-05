import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Schema} from "joi";

/**
 * Outputs the original untouched value instead of the casted value.
 */
export function Empty(schema : any) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : Schema) => {
            return schemaToUpdate.empty(schema);
        });
    }
}
