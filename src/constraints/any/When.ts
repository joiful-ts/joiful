import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Schema} from "joi";
import {Reference} from "joi";
import {WhenOptions} from "joi";

/**
 * Converts the type into an alternatives type where the conditions are merged into the type definition.
 */
export function When(ref : string|Reference, options : WhenOptions) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        getAndUpdateSchema(target, propertyKey, (schema : Schema) => {
            return schema.when(<any>ref, options);
        });
    }
}
