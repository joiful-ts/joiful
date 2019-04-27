import {
    AnyClass,
    ConstraintDefinitionError,
    getJoiSchema,
    Joi,
    MapAllowUnions,
    StringOrSymbolKey,
    TypedPropertyDecorator,
    updateSchema
} from "./core";

type AllowedTypes = object;

export function Nested(clz? : AnyClass) : TypedPropertyDecorator<AllowedTypes> {
    return function <TClass extends MapAllowUnions<TClass, TKey, AllowedTypes>, TKey extends StringOrSymbolKey<TClass>>(target : TClass, propertyKey : TKey) {
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

export function NestedArray(clz : AnyClass) : TypedPropertyDecorator<AllowedTypes> {
    return function <TClass extends MapAllowUnions<TClass, TKey, AllowedTypes>, TKey extends StringOrSymbolKey<TClass>>(target : TClass, propertyKey : TKey) {
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
