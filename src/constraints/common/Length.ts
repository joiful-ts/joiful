import 'reflect-metadata';
import * as Joi from "joi";
import {SCHEMA_KEY, ConstraintDefinitionError} from "../../core";

/**
 * TODO: support array, binary, and object schemas
 */
export function Length(limit : number, encoding? : string) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        if (propertyType !== String) {
            throw new ConstraintDefinitionError(`Property is not a string: ${propertyKey}`);
        }

        let schema = Reflect.getMetadata(SCHEMA_KEY, target, propertyKey);
        if (!schema) {
            throw new ConstraintDefinitionError(`No validation schema exists for property: ${propertyKey}, please specify a type schema first.`);
        } else {
            schema = schema.length(limit, encoding);
            Reflect.defineMetadata(SCHEMA_KEY, schema, target, propertyKey);
        }
    }
}