import * as Joi from 'joi';
import { partialOf } from 'jest-helpers';
import { mocked } from 'ts-jest/utils';
import {
    string,
    validate,
    validateAsClass,
    validateArrayAsClass,
    Validator,
    ValidationResult,
    isValidationPass,
    isValidationFail,
} from '../../src';
import { InvalidValidationTarget, NoValidationSchemaForClassError } from '../../src/validation';

interface ResetPasswordForm {
    emailAddress?: string;
}

describe('ValidationResult', () => {
    let valid: ValidationResult<ResetPasswordForm>;
    let invalid: ValidationResult<ResetPasswordForm>;

    beforeEach(() => {
        valid = {
            value: {
                emailAddress: 'joe@example.com',
            },
            error: null,
            errors: null,
            warning: null,
        };
        invalid = {
            value: {
                emailAddress: 'joe',
            },
            error: {
                name: 'ValidationError',
                message: 'Invalid email',
                isJoi: true,
                details: [
                    {
                        message: "'email' is not a valid email",
                        type: 'email',
                        path: ['emailAddress'],
                    },
                ],
                annotate: () => '',
                _original: null,
            } as Joi.ValidationError,
            errors: null,
            warning: null,
        };
    });

    describe('isValidationPass', () => {
        it('returns true if validation result was a pass', () => {
            expect(isValidationPass(valid)).toBe(true);
        });

        it('returns false if validation result was a fail', () => {
            expect(isValidationPass(invalid)).toBe(false);
        });
    });

    describe('isValidationFail', () => {
        it('returns true if validation result was a fail', () => {
            expect(isValidationFail(invalid)).toBe(true);
        });

        it('returns false if validation result was a pass', () => {
            expect(isValidationFail(valid)).toBe(false);
        });
    });
});

describe('Validation', () => {
    type ValidatorLike = Pick<Validator, 'validate' | 'validateAsClass' | 'validateArrayAsClass'>;

    function getLoginClass() {
        // Define the class for each test, so that the schema is re-created every time.
        class Login {
            @string()
            emailAddress?: string;

            @string()
            password?: string;
        }
        return Login;
    }

    let Login: ReturnType<typeof getLoginClass>;
    let login: InstanceType<typeof Login>;
    let loginSchema: Joi.ObjectSchema;
    let loginArraySchema: Joi.ArraySchema;
    let joi: typeof Joi;

    function mockJoiValidateSuccess<T>(value: T) {
        mocked(loginSchema).validate.mockReturnValueOnce({
            value: value,
        });
        mocked(loginArraySchema).validate.mockReturnValueOnce({
            value: value,
        });
    }

    function assertValidateInvocation<T>(schema: Joi.Schema, value: T) {
        expect(schema.validate).toHaveBeenCalledTimes(1);
        expect(schema.validate).toHaveBeenCalledWith(value, {});
    }

    function assertValidateSuccess<T>(result: ValidationResult<T>, expectedValue: T) {
        expect(result.value).toEqual(expectedValue);
        expect(result.error).toBe(null);
        expect(result.errors).toBe(null);
        expect(result.warning).toBe(null);
    }

    function assertValidateFailure<T>(result: ValidationResult<T>, expectedValue: T) {
        expect(result.value).toEqual(expectedValue);
        expect(result.error).toBeTruthy();
        expect(result.errors).toBe(null);
        expect(result.warning).toBe(null);
    }

    beforeEach(() => {
        Login = getLoginClass();
        loginSchema = partialOf<Joi.ObjectSchema>({
            validate: jest.fn(),
        });
        loginArraySchema = partialOf<Joi.ArraySchema>({
            validate: jest.fn(),
        });
        login = new Login();
        login.emailAddress = 'joe@example.com';
        joi = partialOf<typeof Joi>({
            array: jest.fn().mockReturnValue({
                // Required for `validateArrayAsClass()`
                items: jest.fn().mockReturnValue(loginArraySchema),
            }),
            object: jest.fn().mockReturnValue({
                // Required for `getJoiSchema()`
                keys: jest.fn().mockReturnValue(loginSchema),
            }),
        });
    });

    describe('Validator constructor', () => {
        it('should use validation options of the Joi instance by default', () => {
            const validator = new Validator();
            const result = validator.validate(login);
            assertValidateSuccess(result, login);
        });

        it('should optionally accept validation options to use', () => {
            const validator = new Validator({ presence: 'required' });
            const result = validator.validate(login);
            assertValidateFailure(result, login);
        });

        it('should support a custom instance of Joi', () => {
            mockJoiValidateSuccess(login);
            const validator = new Validator({ joi });
            const result = validator.validate(login);
            assertValidateSuccess(result, login);
            assertValidateInvocation(loginSchema, login);
        });
    });

    describe.each([
        ['new instance', () => new Validator()],
        ['default instance', () => ({
            validate,
            validateAsClass,
            validateArrayAsClass,
        })],
    ] as [string, () => ValidatorLike][])(
        'Validator - %s',
        (
            _testSuiteDescription: string,
            validatorFactory: () => Pick<Validator, 'validate' | 'validateAsClass' | 'validateArrayAsClass'>,
    ) => {
        let validator: ValidatorLike;

        beforeEach(() => {
            validator = validatorFactory();
        });

        describe('validate', () => {
            it('should validate an instance of a decorated class', () => {
                const result = validator.validate(login);
                assertValidateSuccess(result, login);
            });

            it('should optionally accept validation options to use', () => {
                const result = validator.validate(login, { presence: 'required' });
                assertValidateFailure(result, login);
            });

            it('should support a custom instance of Joi', () => {
                mockJoiValidateSuccess(login);
                const result = validator.validate(login, { joi });
                assertValidateSuccess(result, login);
                assertValidateInvocation(loginSchema, login);
            });

            it('should error when trying to validate null', () => {
                expect(() => validator.validate(null)).toThrowError(new InvalidValidationTarget());
            });
        });

        describe('validateAsClass', () => {
            it('should accept a plain old javascript object to validate', () => {
                const result = validator.validateAsClass({ ...login }, Login);
                assertValidateSuccess(result, login);
            });

            it('should optionally accept validation options to use', () => {
                const result = validator.validateAsClass({ ...login }, Login, { presence: 'required' });
                assertValidateFailure(result, login);
            });

            it('should support a custom instance of Joi', () => {
                const inputValue = { ...login };
                mockJoiValidateSuccess(inputValue);
                const result = validator.validateAsClass(inputValue, Login, { joi });
                assertValidateSuccess(result, login);
                assertValidateInvocation(loginSchema, login);
            });

            it('should error when trying to validate null', () => {
                expect(() => validator.validateAsClass(null, Login)).toThrowError(new InvalidValidationTarget());
            });

            it('should error when class does not have an associated schema', () => {
                class AgeForm {
                    age?: number;
                }
                const validate = () => validator.validateAsClass(
                    {
                        name: 'Joe',
                    },
                    AgeForm,
                );
                expect(validate).toThrowError(new NoValidationSchemaForClassError(AgeForm));
            });
        });

        describe('validateArrayAsClass', () => {
            it('should accept an array of plain old javascript objects to validate', () => {
                const result = validator.validateArrayAsClass([{ ...login }], Login);
                assertValidateSuccess(result, [login]);
            });

            it('should optionally accept validation options to use', () => {
                const result = validator.validateArrayAsClass([{ ...login }], Login, { presence: 'required' });
                assertValidateFailure(result, [login]);
            });

            it('should support a custom instance of Joi', () => {
                const inputValue = [{ ...login }];
                mockJoiValidateSuccess(inputValue);
                const result = validator.validateArrayAsClass(inputValue, Login, { joi });
                assertValidateSuccess(result, [login]);
                assertValidateInvocation(loginArraySchema, [login]);
            });

            it('should error when trying to validate null', () => {
                expect(
                    () => validator.validateArrayAsClass(null as any, Login),
                ).toThrowError(new InvalidValidationTarget());
            });

            it('should error when items class does not have an associated schema', () => {
                class AgeForm {
                    age?: number;
                }
                const validate = () => validator.validateArrayAsClass(
                    [{
                        name: 'Joe',
                    }],
                    AgeForm,
                );
                expect(validate).toThrowError(new NoValidationSchemaForClassError(AgeForm));
            });
        });
    });

    describe('On-demand schema generation', () => {
        it('should only convert working schema to a final schema once - validate', () => {
            expect(joi.object).not.toHaveBeenCalled();

            mockJoiValidateSuccess(login);
            validate(login, { joi });
            expect(joi.object).toHaveBeenCalledTimes(1);

            mockJoiValidateSuccess(login);
            validate(login, { joi });
            expect(joi.object).toHaveBeenCalledTimes(1);
        });

        it('should only convert working schema to a final schema once - validateAsClass', () => {
            expect(joi.object).not.toHaveBeenCalled();

            mockJoiValidateSuccess(login);
            validateAsClass(login, Login, { joi });
            expect(joi.object).toHaveBeenCalledTimes(1);

            mockJoiValidateSuccess(login);
            validateAsClass(login, Login, { joi });
            expect(joi.object).toHaveBeenCalledTimes(1);
        });

        it('should only convert working schema to a final schema once, and always creates a new array schema - validateArrayAsClass', () => {
            expect(joi.object).not.toHaveBeenCalled();
            expect(joi.array).not.toHaveBeenCalled();

            mockJoiValidateSuccess([login]);
            validateArrayAsClass([login], Login, { joi });
            expect(joi.object).toHaveBeenCalledTimes(1);
            expect(joi.array).toHaveBeenCalledTimes(1);

            mockJoiValidateSuccess([login]);
            validateArrayAsClass([login], Login, { joi });
            expect(joi.object).toHaveBeenCalledTimes(1);
            expect(joi.array).toHaveBeenCalledTimes(2);
        });
    });
});

describe('NoValidationSchemaForClassError', () => {
    it('should have a helpful message', () => {
        expect(new NoValidationSchemaForClassError(class {
            emailAddress?: string;
        }).message).toEqual(
            'No validation schema was found for class. Did you forget to decorate the class?',
        );
    });

    it('should have a helpful message including classname if it has one', () => {
        class ForgotPassword {
            emailAddress?: string;
        }
        expect(new NoValidationSchemaForClassError(ForgotPassword).message).toEqual(
            'No validation schema was found for class ForgotPassword. Did you forget to decorate the class?',
        );
    });
});
