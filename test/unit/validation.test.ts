import * as Joi from '@hapi/joi';
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
import { AnyClass } from '../../src/core';

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
        };
        invalid = {
            value: {
                emailAddress: 'joe',
            },
            error: {
                name: 'InvalidEmail',
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
                _object: null,
            },
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

    let login: {
        emailAddress?: string;
        password?: string;
    };
    let Login: AnyClass;
    let dummyArrayItemSchema = Object.freeze({});
    let dummySchema = Object.freeze({});
    let mockJoi: {
        array: jest.MockedFunction<typeof Joi['array']>;
        object: jest.MockedFunction<typeof Joi['object']>;
        validate: jest.MockedFunction<typeof Joi['validate']>;
    };

    function createMockJoi() {
        return {
            array: jest.fn().mockReturnValue({
                items: jest.fn().mockReturnValue(dummyArrayItemSchema), // required for `validateArrayAsClass()`
            }),
            object: jest.fn().mockReturnValue({
                keys: jest.fn().mockReturnValue(dummySchema), // required for `getJoiSchema()`
            }),
            validate: jest.fn(),
        };
    }

    function mockJoiValidateSuccess<T>(value: T) {
        mockJoi.validate.mockReturnValueOnce({
            error: null,
            value,
        });
    }

    function assertMockJoiValidateInvocation<T>(value: T, expectedSchema: Readonly<{}> = dummySchema) {
        expect(mockJoi.validate.mock.calls.length).toEqual(1);
        expect(mockJoi.validate.mock.calls[0]).toEqual([value, expectedSchema, {}]);
    }

    function assertValidateSuccess<T>(result: ValidationResult<T>, expectedValue: T) {
        expect(result.value).toEqual(expectedValue);
        expect(result.error).toBe(null);
    }

    function assertValidateFailure<T>(result: ValidationResult<T>, expectedValue: T) {
        expect(result.value).toEqual(expectedValue);
        expect(result.error).toBeTruthy();
    }

    beforeEach(() => {
        // Define the class for each test, so that the schema is re-created every time.
        class LoginClass {
            @string()
            emailAddress?: string;

            @string()
            password?: string;
        }
        login = new LoginClass();
        login.emailAddress = 'joe@example.com';
        Login = LoginClass;
        mockJoi = createMockJoi();
    });

    afterEach(() => {
        mockJoi.array.mockReset();
        mockJoi.object.mockReset();
        mockJoi.validate.mockReset();
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
            const validator = new Validator({
                joi: mockJoi,
            });
            const result = validator.validate(login);
            assertValidateSuccess(result, login);
            assertMockJoiValidateInvocation(login);
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
                const result = validator.validate(login, {
                    joi: mockJoi,
                });
                assertValidateSuccess(result, login);
                assertMockJoiValidateInvocation(login);
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
                const result = validator.validateAsClass(inputValue, Login, {
                    joi: mockJoi,
                });
                assertValidateSuccess(result, login);
                assertMockJoiValidateInvocation(inputValue);
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
                const result = validator.validateArrayAsClass(inputValue, Login, {
                    joi: mockJoi,
                });
                assertValidateSuccess(result, [login]);
                assertMockJoiValidateInvocation(inputValue, dummyArrayItemSchema);
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
            expect(mockJoi.object.mock.calls.length).toEqual(0);
            mockJoiValidateSuccess(login);
            validate(login, {
                joi: mockJoi,
            });
            expect(mockJoi.object.mock.calls.length).toEqual(1);
            mockJoiValidateSuccess(login);
            validate(login, {
                joi: mockJoi,
            });
            expect(mockJoi.object.mock.calls.length).toEqual(1);
        });

        it('should only convert working schema to a final schema once - validateAsClass', () => {
            expect(mockJoi.object.mock.calls.length).toEqual(0);
            mockJoiValidateSuccess(login);
            validateAsClass(login, Login, {
                joi: mockJoi,
            });
            expect(mockJoi.object.mock.calls.length).toEqual(1);
            mockJoiValidateSuccess(login);
            validateAsClass(login, Login, {
                joi: mockJoi,
            });
            expect(mockJoi.object.mock.calls.length).toEqual(1);
        });

        it('should only convert working schema to a final schema once, and always creates a new array schema - validateArrayAsClass', () => {
            expect(mockJoi.object.mock.calls.length).toEqual(0);
            expect(mockJoi.array.mock.calls.length).toEqual(0);
            mockJoiValidateSuccess([login]);
            validateArrayAsClass([login], Login, {
                joi: mockJoi,
            });
            expect(mockJoi.object.mock.calls.length).toEqual(1);
            expect(mockJoi.array.mock.calls.length).toEqual(1);
            mockJoiValidateSuccess([login]);
            validateArrayAsClass([login], Login, {
                joi: mockJoi,
            });
            expect(mockJoi.object.mock.calls.length).toEqual(1);
            expect(mockJoi.array.mock.calls.length).toEqual(2);
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
