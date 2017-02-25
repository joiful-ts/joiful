import {Reference, NumberSchema} from "joi";
import {constraintDecorator, typeConstraintDecorator} from "../core";

export namespace NumberConstraints {
    export function Greater(limit : number|Reference) : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.greater(<any>limit);
        });
    }

    export function Integer() : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.integer();
        });
    }

    export function Less(limit : number|Reference) : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.less(<any>limit);
        });
    }

    export function Max(limit : number|Reference) : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.max(<any>limit);
        });
    }

    export function Min(limit : number|Reference) : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.min(<any>limit);
        });
    }

    export function Multiple(base : number) : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.multiple(base);
        });
    }

    export function Negative() : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.negative();
        });
    }

    export function NumberSchema() : PropertyDecorator {
        return typeConstraintDecorator([Number], (Joi) => {
            return Joi.number();
        });
    }

    export function Positive() : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.positive();
        });
    }

    export function Precision(limit : number) : PropertyDecorator {
        return constraintDecorator([Number], (schema : NumberSchema) => {
            return schema.precision(limit);
        });
    }
}