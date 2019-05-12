import { Schema } from 'joi';
import { getPropertySchema, Joi, updateSchema, ensureSchemaNotAlreadyDefined } from '../core';

export function JoiSchema(schemaBuilder: (joi: typeof Joi) => Schema) {
    return (target: object, propertyKey: string | symbol) => {
        let schema = getPropertySchema(target, propertyKey);
        ensureSchemaNotAlreadyDefined(schema, propertyKey);
        schema = schemaBuilder(Joi)
        updateSchema(target, propertyKey, schema);
    };
};
