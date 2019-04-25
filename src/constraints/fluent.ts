import * as joiModule from "joi";
import { getPropertySchema, ConstraintDefinitionError, updateSchema } from '../core';

export function Joi(schemaBuilder: (joi: typeof joiModule) => joiModule.Schema) {
    return (target: object, propertyKey: string | symbol) => {
        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${String(propertyKey)}`);
        } else {
            schema = schemaBuilder(joiModule)
            updateSchema(target, propertyKey, schema);
        }
    };
};
