import * as Joi from "joi";
import {updateSchema, SCHEMA_KEY, ConstraintDefinitionError} from "../core";
import {getPropertySchema} from "../core";
import {allowTypes} from "../core";
import {getAndUpdateSchema} from "../core";
import {Reference} from "joi";
import {NumberSchema} from "joi";

export function Greater(limit : number|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.greater(<any>limit);
        });
    }
}

export function Integer() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.integer();
        });
    }
}

export function Less(limit : number|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.less(<any>limit);
        });
    }
}

export function Max(limit : number|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.max(<any>limit);
        });
    }
}

export function Min(limit : number|Reference) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.min(<any>limit);
        });
    }
}

export function Multiple(base : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.multiple(base);
        });
    }
}

export function Negative() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.negative();
        });
    }
}

export function NumberSchema() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        let schema = getPropertySchema(target, propertyKey);
        if (schema) {
            throw new ConstraintDefinitionError(`A validation schema already exists for property: ${propertyKey}`);
        } else {
            schema = Joi.number();
            updateSchema(target, propertyKey, schema);
        }
    }
}

export function Positive() : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.positive();
        });
    }
}

export function Precision(limit : number) : PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) : void {
        allowTypes(target, propertyKey, [Number]);

        getAndUpdateSchema(target, propertyKey, (schema : NumberSchema) => {
            return schema.precision(limit);
        });
    }
}
