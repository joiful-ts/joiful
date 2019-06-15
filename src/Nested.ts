import {
    AnyClass,
    ConstraintDefinitionError,
    getJoiSchema,
    Joi,
    MapAllowUnions,
    StringOrSymbolKey,
    TypedPropertyDecorator,
    updateSchema,
} from './core';

type AllowedTypes = object;

export class NestedPropertyTypeUnknown extends ConstraintDefinitionError {
    name = 'NestedPropertyTypeUnknown';

    constructor(propertyKey: string | Symbol) {
        super(
            `Could not determine the type of the nested property "${String(propertyKey)}". ` +
            'Please pass the class to the Nested() decorator.',
        );
    }
}

export function Nested(clz?: AnyClass): TypedPropertyDecorator<AllowedTypes> {
    return <TClass extends MapAllowUnions<TClass, TKey, AllowedTypes>, TKey extends StringOrSymbolKey<TClass>>(
        target: TClass,
        propertyKey: TKey,
    ) => {
        let propertyType: AnyClass;
        if (clz) {
            propertyType = clz;
        } else {
            propertyType = Reflect.getMetadata('design:type', target, propertyKey);
        }
        if (!propertyType || propertyType === Object) {
            throw new NestedPropertyTypeUnknown(propertyKey);
        }
        const nestedSchema = getJoiSchema(propertyType);
        updateSchema(target, propertyKey, nestedSchema);
    };
}

export function NestedArray(clz: AnyClass): TypedPropertyDecorator<AllowedTypes> {
    return <TClass extends MapAllowUnions<TClass, TKey, AllowedTypes>, TKey extends StringOrSymbolKey<TClass>>(
        target: TClass,
        propertyKey: TKey,
    ) => {
        let propertyType: AnyClass;
        if (clz) {
            propertyType = clz;
        } else {
            propertyType = Reflect.getMetadata('design:type', target, propertyKey);
        }
        if (!propertyType) {
            throw new NestedPropertyTypeUnknown(propertyKey);
        }
        const nestedSchema = getJoiSchema(propertyType);
        updateSchema(target, propertyKey, Joi.array().items(nestedSchema));
    };
}
