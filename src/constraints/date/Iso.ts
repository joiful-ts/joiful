import * as Joi from "joi";
import {allowTypes} from "../../core";
import {getAndUpdateSchema} from "../../core";
import {DateSchema} from "joi";
import {Reference} from "joi";

export function Iso() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Date, String]); // hmm

        getAndUpdateSchema(target, propertyKey, (schema : DateSchema) => {
            return schema.iso();
        });
    }
}