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
    class Login {
        @string()
        emailAddress?: string;

        @string()
        password?: string;
    }

    let login: Login;

    beforeEach(() => {
        login = new Login();
        login.emailAddress = 'joe@example.com';
    });

    describe('Validator', () => {
        let validator: Validator;

        beforeEach(() => {
            validator = new Validator();
        });

        describe('constructor', () => {
            it('should use validation options of the Joi instance by default', () => {
                const result = validator.validate(login);
                expect(result.value).toEqual(login);
                expect(result.error).toBe(null);
            });

            it('should optionally accept validation options to use', () => {
                validator = new Validator({ presence: 'required' });
                const result = validator.validate(login);
                expect(result.value).toEqual(login);
                expect(result.error).toBeTruthy();
            });
        });

        describe('validate', () => {
            it('should validate an instance of a decorated class', () => {
                const result = validator.validate(login);
                expect(result.value).toEqual(login);
                expect(result.error).toBe(null);
            });

            it('should optionally accept validation options to use', () => {
                const result = validator.validate(login, { presence: 'required' });
                expect(result.value).toEqual(login);
                expect(result.error).toBeTruthy();
            });

            it('should error when trying to validate null', () => {
                expect(() => validator.validate(null)).toThrowError(new InvalidValidationTarget());
            });
        });

        describe('validateAsClass', () => {
            it('should accept a plain old javascript object to validate', () => {
                const result = validator.validateAsClass({ ...login }, Login);
                expect(result.value).toEqual(login);
                expect(result.error).toBe(null);
            });

            it('should optionally accept validation options to use', () => {
                const result = validator.validateAsClass({ ...login }, Login, { presence: 'required' });
                expect(result.value).toEqual(login);
                expect(result.error).toBeTruthy();
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
                expect(result.value).toEqual([login]);
                expect(result.error).toBe(null);
            });

            it('should optionally accept validation options to use', () => {
                const result = validator.validateArrayAsClass([{ ...login }], Login, { presence: 'required' });
                expect(result.value).toEqual([login]);
                expect(result.error).toBeTruthy();
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

    describe('validate', () => {
        it('should validate an instance of a decorated class', () => {
            const result = validate(login);
            expect(result.value).toEqual(login);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            const result = validate(login, { presence: 'required' });
            expect(result.value).toEqual(login);
            expect(result.error).toBeTruthy();
        });

        it('should error when trying to validate null', () => {
            expect(() => validate(null)).toThrowError(new InvalidValidationTarget());
        });
    });

    describe('validateAsClass', () => {
        it('should accept a plain old javascript object to validate', () => {
            const result = validateAsClass({ ...login }, Login);
            expect(result.value).toEqual(login);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            const result = validateAsClass({ ...login }, Login, { presence: 'required' });
            expect(result.value).toEqual(login);
            expect(result.error).toBeTruthy();
        });

        it('should error when trying to validate null', () => {
            expect(() => validateAsClass(null, Login)).toThrowError(new InvalidValidationTarget());
        });
    });

    describe('validateArrayAsClass', () => {
        it('should accept an array of plain old javascript objects to validate', () => {
            const result = validateArrayAsClass([{ ...login }], Login);
            expect(result.value).toEqual([login]);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            const result = validateArrayAsClass([{ ...login }], Login, { presence: 'required' });
            expect(result.value).toEqual([login]);
            expect(result.error).toBeTruthy();
        });

        it('should error when trying to validate null', () => {
            expect(
                () => validateArrayAsClass(null as any, Login),
            ).toThrowError(new InvalidValidationTarget());
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
