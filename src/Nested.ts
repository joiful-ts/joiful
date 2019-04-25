import {
    AnyClass,
    ConstraintDefinitionError,
    getJoiSchema,
    Joi,
    StringOrSymbolKey,
    TypedPropertyDecorator,
    updateSchema
} from "./core";

export function Nested<TClass, TKey extends StringOrSymbolKey<TClass>>(clz? : AnyClass) : TypedPropertyDecorator<TClass, TKey> {
    return function (target : TClass, propertyKey : TKey) {
        // allowTypes(target, propertyKey, [Object]);
        let propertyType : AnyClass;
        if (clz) {
            propertyType = clz;
        } else {
            propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        }
        if (!propertyType || propertyType === Object) {
            throw new ConstraintDefinitionError(`Could not determine the type of the nested property "${ String(propertyKey) }". Please pass the class to the Nested() decorator.`);
        }
        const nestedSchema = getJoiSchema(propertyType);
        updateSchema(target, propertyKey, nestedSchema);
    };
}

export function NestedArray<TClass, TKey extends StringOrSymbolKey<TClass>>(clz : AnyClass) : TypedPropertyDecorator<TClass, TKey> {
    return function (target : TClass, propertyKey : TKey) {
        // allowTypes(target, propertyKey, [Object]);
        let propertyType : AnyClass;
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
