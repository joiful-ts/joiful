import * as Joi from "joi";
import {SCHEMA_KEY, ConstraintDefinitionError} from "../../core";
import {updateSchema} from "../../core";
import {allowTypes} from "../../core";
import {getPropertySchema} from "../../core";

/**
 * TODO: support array, binary, and object schemas
 */
export function Length(limit : number, encoding? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [String]);

        let schema = getPropertySchema(target, propertyKey);
        if (!schema) {
            throw new ConstraintDefinitionError(`No validation schema exists for property: ${propertyKey}, please specify a type schema first.`);
        } else {
            schema = schema.length(limit, encoding);
            updateSchema(target, propertyKey, schema);
        }
    }
}