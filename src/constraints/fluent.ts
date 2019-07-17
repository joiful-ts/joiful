import * as Joi from '@hapi/joi';
import { getPropertySchema, updateSchema, ensureSchemaNotAlreadyDefined, StringOrSymbolKey } from '../core';

export function JoiSchema(schemaBuilder: (joi: typeof Joi) => Joi.Schema) {
    return <TClass, TKey extends StringOrSymbolKey<TClass>>(target: TClass, propertyKey: TKey) => {
        let schema = getPropertySchema(target, propertyKey);
        ensureSchemaNotAlreadyDefined(schema, propertyKey);
        schema = schemaBuilder(Joi);
        updateSchema(target, propertyKey, schema);
    };
}
