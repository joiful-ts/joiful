export const SCHEMA_KEY = "tsdv:schema";

export class ConstraintDefinitionError extends Error {
    name = "ConstraintDefinitionError";

    constructor(public message? : string) {
        super(message);
    }
}
