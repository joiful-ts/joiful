import {typeConstraintDecorator, constraintDecorator} from "../core";
import {FunctionSchema, Schema} from "joi";

export function Arity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : Schema) => {
        return (schema as FunctionSchema).arity(n);
    });
}

export function FuncSchema(schemaBuilder?: (schema: FunctionSchema) => FunctionSchema) : PropertyDecorator {
    return typeConstraintDecorator([Function], (Joi) => {
        let schema = Joi.func();
        if (schemaBuilder) {
            schema = schemaBuilder(schema);
        }
        return schema;
    });
}

export function MaxArity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : Schema) => {
        return (schema as FunctionSchema).maxArity(n);
    });
}

export function MinArity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : Schema) => {
        return (schema as FunctionSchema).minArity(n);
    });
}
