import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {ObjectSchema} from "joi";
import {SchemaMap} from "joi";

export function Keys(schema? : SchemaMap) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        getAndUpdateSchema(target, propertyKey, (schemaToUpdate : ObjectSchema) => {
            return schemaToUpdate.keys(schema);
        });
    }
}