import {typeConstraintDecorator, constraintDecorator} from "../core";
import {FunctionSchema} from "joi";

export function Arity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : FunctionSchema) => {
        return schema.arity(n);
    });
}

export function FuncSchema() : PropertyDecorator {
    return typeConstraintDecorator([Function], (Joi : { func : () => FunctionSchema }) => {
        return Joi.func();
    });
}

export function MaxArity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : FunctionSchema) => {
        return schema.maxArity(n);
    });
}

export function MinArity(n : number) : PropertyDecorator {
    return constraintDecorator([Function], (schema : FunctionSchema) => {
        return schema.minArity(n);
    });
}
