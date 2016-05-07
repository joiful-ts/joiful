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

export function getAndUpdateSchema(target : Object, propertyKey : string|symbol, updateFunction : (schema : any) => any) {
    let schema = getPropertySchema(target, propertyKey);
    if (!schema) {
        throw new ConstraintDefinitionError(`No validation schema exists for property: ${propertyKey}, please specify a type schema first.`);
    } else {
        schema = updateFunction(schema);
        updateSchema(target, propertyKey, schema);
    }
}

export function allowTypes(target : any, propertyKey : string|symbol, types : Function[]) {
    let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
    if (types.indexOf(propertyType) == -1) {
        throw new ConstraintDefinitionError(`Constraint is not supported on property's type: ${propertyKey}`);
    }
}

export function verifyPeers(target : Object, peers : string[]) {
    // Verify that the properties actually exist on the class.
    let notFound : string[] = [];
    for (let peer of peers) {
        let type = Reflect.getMetadata("design:type", target, peer);
        console.log(type);
        if (type === undefined) {
            notFound.push(peer);

        }
    }
    if (notFound.length > 0) {
        let peersString = notFound.map((v : string) => `"${ v }"`).join(', ');
        let msg : string;
        if (notFound.length == 1) {
            msg = `Peer/property ${ peersString } does not exist.`;
        } else {
            msg = `Peers/properties ${ peersString } do not exist.`;
        }
        throw new ConstraintDefinitionError(msg);
    }
}