import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Schema} from "joi";

/**
 * Strict mode sets the options.convert options to false which prevent type casting for the current key and any child keys.
 * @param isStrict - whether strict mode is enabled or not. Defaults to true.
 */
export function Strict(isStrict? : boolean) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : Schema) => {
            return schema.strict(isStrict);
        });
    }
}
