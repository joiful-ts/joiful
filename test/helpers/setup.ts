import * as Joi from 'joi';
import { omit } from 'lodash';
import { getJoi, getJoiSchema } from '../../src/core';
import { Validator } from '../../src/validation';
import { ToBeValidOptions } from '../@types/jest';

const tryToStringify = (value: any) => {
    try {
        return JSON.stringify(value, null, '  ');
    } catch (err) {
        return null;
    }
};

expect.extend({
    toBeValid(candidate: any, options: ToBeValidOptions) {
        const validator = (options && options.validator) || new Validator();
        const Class = options && options.Class;
        const result = Class ?
            validator.validateAsClass(candidate, Class) :
            validator.validate(candidate);

        const pass = result.error === null;
        // tslint:disable-next-line:no-invalid-this
        const isNot = this.isNot;
        const errorMessage = result.error && (result.error.message || result.error);

        const candidateAsString = tryToStringify(candidate);

        const message =
            `expected candidate to ${isNot ? 'fail' : 'pass'} validation` +
            (!candidateAsString ? '' : `:\n\n  ${candidateAsString.replace(/\n/gm, '\n  ')}\n\n${errorMessage}`.trim());

        return {
            pass,
            message: () => message,
        };
    },
    toMatchSchemaMap(Class: any, expectedSchemaMap: Joi.SchemaMap, options?: { joi?: typeof Joi }) {
        const SCHEMA_PROPERTIES_TO_IGNORE = ['$_super'];

        const trimSchema = (schema: Joi.ObjectSchema<any> | undefined) =>
            schema && omit(schema, SCHEMA_PROPERTIES_TO_IGNORE);

        // tslint:disable-next-line:no-invalid-this
        const isNot = this.isNot;
        let pass = false;
        let message = `expected Class to ${isNot ? 'not ' : ''}have schema matching expected schema`;
        const joi = getJoi(options);
        const schema = getJoiSchema(Class, joi);
        const expectedSchema = joi.object().keys(expectedSchemaMap);

        try {
            expect(trimSchema(schema)).toEqual(trimSchema(expectedSchema));
            pass = true;
        } catch {
        }

        return {
            pass,
            message: () => message,
        };
    },
});
