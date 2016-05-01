import 'reflect-metadata';
import * as Joi from "joi";
import {SCHEMA_KEY, ConstraintDefinitionError} from "../../core";


export function StringSchema() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        if (propertyType !== String) {
            throw new ConstraintDefinitionError(`Property is not a string: ${propertyKey}`);
        }

        let metadata = Reflect.getMetadata(SCHEMA_KEY, target, propertyKey);
        if (metadata) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            let schema = Joi.string();
            //console.log(schema);
            Reflect.defineMetadata(SCHEMA_KEY, schema, target, propertyKey);
            //var keys = Reflect.getMetadataKeys(target);
            //console.log(keys);
        }
    }
}