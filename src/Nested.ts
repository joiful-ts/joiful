import {
    getJoiSchema,
    updateSchema
} from "./core";

export function Nested() : PropertyDecorator {
    return function (target : Object, propertyKey : string | symbol) {
        // allowTypes(target, propertyKey, [Object]);
        let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
        const nestedSchema = getJoiSchema(propertyType);
        updateSchema(target, propertyKey, nestedSchema);
    };
}
