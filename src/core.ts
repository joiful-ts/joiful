export const SCHEMA_KEY = "tsdv:schema";

export class ConstraintDefinitionError extends Error {
    name = "ConstraintDefinitionError";

    constructor(public message? : string) {
        super(message);
    }
}
//
//export function getOrCreateSchema(target : Object, propertyKey : string) : any {
//    let metadata = Reflect.getMetadata(SCHEMA_KEY, target, propertyKey);
//    if (metadata) {
//
//    }
//}
//
//export function setSchema(target : Object, propertyKey : string, schema : any) : void {
//
//}