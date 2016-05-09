import * as Joi from "joi";
import {updateSchema, SCHEMA_KEY, ConstraintDefinitionError} from "../core";
import {getPropertySchema} from "../core";
import {allowTypes} from "../core";

export function BooleanSchema() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Boolean]);

        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schema = Joi.boolean();
            updateSchema(target, propertyKey, schema);
        }
    }
}