import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {Reference} from "joi";
import {ArraySchema} from "joi";

export function Length(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Array]);

        getAndUpdateSchema(target, propertyKey, (schema : ArraySchema) => {
            return schema.length(limit);
        });
    }
}