import { ValidationResult, isValidationPass, isValidationFail } from '../../src/validation';

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
                        path: 'emailAddress',
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
