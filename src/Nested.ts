import {ConstraintDefinitionError, getJoiSchema, Joi, updateSchema} from "./core";

export class NestedPropertyTypeUnknown extends ConstraintDefinitionError {
    name = 'NestedPropertyTypeUnknown';

    constructor(propertyKey: string | Symbol) {
        super(`Could not determine the type of the nested property "${ String(propertyKey) }". Please pass the class to the Nested() decorator.`);
    }
}

export function Nested(clz? : Function) : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        // allowTypes(target, propertyKey, [Object]);
        let propertyType : Function;
        if (clz) {
            propertyType = clz;
        } else {
            propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        }
        if (!propertyType || propertyType === Object) {
            throw new NestedPropertyTypeUnknown(propertyKey);
        }
        const nestedSchema = getJoiSchema(propertyType);
        updateSchema(target, propertyKey, nestedSchema);
    };
}

export function NestedArray(clz : Function) : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        // allowTypes(target, propertyKey, [Object]);
        let propertyType : Function;
        if (clz) {
            propertyType = clz;
        } else {
            propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        }
        if (!propertyType) {
            throw new ConstraintDefinitionError(`Could not determine the type of the nested property "${ String(propertyKey) }". Please pass the class to the Nested() decorator.`);
        }
        const nestedSchema = getJoiSchema(propertyType);
        updateSchema(target, propertyKey, Joi.array().items(nestedSchema));
    };
}
