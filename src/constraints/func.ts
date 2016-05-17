import {typeConstraintDecorator} from "../core";
import {constraintDecorator} from "../core";

declare type FuncSchema = any; // TODO

export function Arity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : FuncSchema) => {
        // TODO: add arity to Joi type definitions
        return schema.arity(n);
    });
}

export function FuncSchema() : PropertyDecorator {
    return typeConstraintDecorator([Function], (Joi : { func : () => FuncSchema }) => {
        return Joi.func();
    });
}

export function MaxArity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : FuncSchema) => {
        // TODO: add maxArity to Joi type definitions
        return schema.maxArity(n);
    });
}

export function MinArity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : FuncSchema) => {
        // TODO: add minArity to Joi type definitions
        return schema.minArity(n);
    });
}
