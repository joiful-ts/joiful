import {typeConstraintDecorator, constraintDecorator} from "../core";
import {FunctionSchema, Schema} from "joi";

export namespace FunctionConstraints {
    export function Arity(n : number) : PropertyDecorator {
        return constraintDecorator([Function], (schema : Schema) => {
            return (schema as FunctionSchema).arity(n);
        });
    }

    export function FuncSchema() : PropertyDecorator {
        return typeConstraintDecorator([Function], (Joi) => {
            return Joi.func();
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
}