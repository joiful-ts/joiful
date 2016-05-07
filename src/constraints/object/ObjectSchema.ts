import * as Joi from "joi";
import {updateSchema, SCHEMA_KEY, ConstraintDefinitionError} from "../../core";
import {getPropertySchema} from "../../core";
import {allowTypes} from "../../core";
import {SchemaMap} from "joi";

export function ObjectSchema(schema? : SchemaMap) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Object]);

        let schemaToCreate = getPropertySchema(target, propertyKey);
        if (schemaToCreate) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schemaToCreate = Joi.object(schema);
            updateSchema(target, propertyKey, schemaToCreate);
        }
    }
}