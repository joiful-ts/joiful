import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ArraySchema} from "joi";
import {Schema} from "joi";

/**
 * List the types in sequence order for the array values..
 */
export function Ordered(...type : Schema[]) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : any) => {
            // TODO: add ordered to the Joi type definitions
            return schema.ordered(type);
        });
    }
}
