import 'reflect-metadata';
export const SCHEMA_KEY = "tsdv:schema";

export class ConstraintDefinitionError extends Error {
    name = "ConstraintDefinitionError";

    constructor(public message? : string) {
        super(message);
    }
}

export function getClassSchema(target : Object) : { [index : string] : any } {
    var classSchema : { [index : string] : any } = Reflect.getMetadata(SCHEMA_KEY, target);
    if (!classSchema) {
        classSchema = {};
        Reflect.defineMetadata(SCHEMA_KEY, classSchema, target);
    }
    return classSchema;
}

export function getPropertySchema(target : Object, propertyKey : string|symbol) {
    var classSchema = getClassSchema(target);
    return classSchema[propertyKey];
}

export function updateSchema(target : Object, propertyKey : string|symbol, schema : any) {
    var classSchema = getClassSchema(target);
    classSchema[propertyKey] = schema;
}

export function allowTypes(target : any, propertyKey : string|symbol, types : Function[]) {
    let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
    if (types.indexOf(propertyType) == -1) {
        throw new ConstraintDefinitionError(`Constraint is not supported on property's type: ${propertyKey}`);
    }
}