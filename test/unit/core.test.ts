import './metadataShim';
import { Schema } from 'joi';
import { Validator } from '../../src/Validator';
import {
    ensureSchemaNotAlreadyDefined,
    ConstraintDefinitionError,
    registerJoi,
    registerLabelProvider,
    LabelProvider,
} from '../../src/core';
import * as Joi from 'joi';
import { StringSchema, Email } from '../../src/constraints/string';
import { Required, Label } from '../../src/constraints/any';

registerJoi(Joi);

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

describe('registerLabelProvider', () => {
    let labelProvider: LabelProvider;

    const getLoginFormClass = () => {
        class LoginForm {
            @Required()
            @Email()
            emailAddress?: string;

            @Required()
            @StringSchema()
            password?: string;

            @Required()
            @Label("Don't you forget about me")
            rememberMe?: boolean;
        }
        return LoginForm;
    };

    describe('when a label transform has been supplied', () => {
        beforeEach(() => {
            labelProvider = jest.fn().mockImplementation((propertyKey) => `${propertyKey}`.toUpperCase());
            registerLabelProvider(labelProvider);
        });

        afterEach(() => {
            registerLabelProvider(undefined);
        });

        it('should use the provided label provider when one supplied', () => {
            const validator = new Validator();
            const result = validator.validateAsClass({}, getLoginFormClass(), { abortEarly: false });
            expect(result).toHaveProperty(['error', 'details', 0, 'context', 'key'], 'EMAILADDRESS');
            expect(result).toHaveProperty(['error', 'details', 1, 'context', 'key'], 'PASSWORD');
        });

        it('should use labels provided by a Label decorators', () => {
            const validator = new Validator();
            const result = validator.validateAsClass({}, getLoginFormClass(), { abortEarly: false });
            expect(result).toHaveProperty(['error', 'details', 2, 'context', 'key'], "Don't you forget about me");
        });
    });

    it('should not use a label provider when none supplied', () => {
        const validator = new Validator();
        const result = validator.validateAsClass({}, getLoginFormClass(), { abortEarly: false });
        expect(result).toHaveProperty(['error', 'details', 0, 'context', 'key'], 'emailAddress');
        expect(result).toHaveProperty(['error', 'details', 1, 'context', 'key'], 'password');
        expect(result).toHaveProperty(['error', 'details', 2, 'context', 'key'], "Don't you forget about me");
    });
});
