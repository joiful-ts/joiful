import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {Schema} from "joi";

export function Pattern(regex : RegExp, schema : Schema) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.pattern(regex, schema);
        });
    }
}