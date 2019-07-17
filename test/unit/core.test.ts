import { Schema } from '@hapi/joi';
import { ensureSchemaNotAlreadyDefined, ConstraintDefinitionError } from '../../src/core';

describe('ensureSchemaNotAlreadyDefined', () => {
    it('should throw an error if the schema is defined', () => {
        const func = () => ensureSchemaNotAlreadyDefined({} as Schema, 'emailAddress');
        const expected = new ConstraintDefinitionError('A validation schema already exists for property: emailAddress');
        expect(func).toThrow(expected);
    });

    it('should not throw an error if the schema is not defined', () => {
        const func = () => ensureSchemaNotAlreadyDefined(undefined, 'emailAddress');
        expect(func).not.toThrow();
    });
});
