import * as Joi from 'joi';
import { testConstraint } from './testUtil';
import { Joiful, string, boolean } from '../../src';
import { Validator, MultipleValidationError } from '../../src/validation';
import * as Case from 'case';
import { IncompatibleJoiVersion } from '../../src/core';

describe('joiful', () => {
    describe('when using the default instance of Joiful', () => {
        class Login {
            @string()
                .email()
                .required()
                .label('Email Address')
            emailAddress!: string;

            @string()
                .empty('')
                .required()
                .exactLength(8)
                .label('Password')
            password!: string;
        }

        testConstraint(
            () => {
                return Login;
            },
            [
                { emailAddress: 'email@example.com', password: 'password' },
            ],
            [
                { emailAddress: 'nope', password: 'password' },
                { emailAddress: 'email@example.com', password: '' },
                { emailAddress: 'email@example.com', password: 'nope' },
            ],
        );
    });

    describe('when constructing an isolated instance of Joiful', () => {
        let jf: Joiful;

        beforeEach(() => {
            jf = new Joiful();
        });

        testConstraint(
            () => {
                class Login {
                    @jf.string()
                        .email()
                        .required()
                        .label('Email Address')
                    emailAddress!: string;

                    @jf.string()
                        .empty('')
                        .required()
                        .exactLength(8)
                        .label('Password')
                    password!: string;
                }
                return Login;
            },
            [
                { emailAddress: 'email@example.com', password: 'password' },
            ],
            [
                { emailAddress: 'nope', password: 'password' },
                { emailAddress: 'email@example.com', password: '' },
                { emailAddress: 'email@example.com', password: 'nope' },
            ],
        );

        it('should error if joi version does not match the major version of joi expected by joiful', () => {
            const createJoiful = () => {
                const jf = new Joiful({
                    joi: { version: '-1.0.0' } as any as typeof Joi,
                });
                return jf;
            };

            expect(createJoiful).toThrowError(new IncompatibleJoiVersion({ major: '-1', minor: '0', patch: '0' }));
        });

        describe('and specifying a label provider', () => {
            beforeEach(() => {
                jf = new Joiful({
                    labelProvider: (propertyKey) => Case.sentence(`${propertyKey}`),
                });
            });

            it('should use the label provider to generate property labels', () => {
                class MarketingForm {
                    @jf.boolean().required()
                    signUpForSpam!: boolean;
                }

                const validator = new Validator();
                const result = validator.validateAsClass({}, MarketingForm);

                expect(result.error).toBeTruthy();
                expect(result.error!.message).toContain('Sign up for spam');
                expect(result.error!.message).not.toContain('signUpForSpam');
            });

            it('should allow explicit label calls to override automatically generated labels', () => {
                class MarketingForm {
                    @jf.boolean().required()
                    signUpForSpam!: boolean;

                    @jf.boolean().required().label('Free candy')
                    allowSellingOfMyData!: boolean;
                }

                const validator = new Validator({ abortEarly: false });
                const result = validator.validateAsClass({}, MarketingForm);

                expect(result.error).toBeTruthy();

                expect(result.error!.message).toContain('Sign up for spam');
                expect(result.error!.message).not.toContain('signUpForSpam');

                expect(result.error!.message).toContain('Free candy');
                expect(result.error!.message).not.toContain('allowSellingOfMyData');
            });

            it('should not effect labels of classes decorated using Joiful default instance decorators', () => {
                class AnotherMarketingForm {
                    @boolean().required()
                    signUpForSpam!: boolean;
                }

                const validator = new Validator();
                const result = validator.validateAsClass({}, AnotherMarketingForm);

                expect(result.error).toBeTruthy();
                expect(result.error!.message).not.toContain('Sign up for spam');
                expect(result.error!.message).toContain('signUpForSpam');
            });

            it('should not generate labels if output of label provider is not a string', () => {
                jf = new Joiful({
                    labelProvider: () => undefined,
                });

                const getForm = () => {
                    class MarketingForm {
                        @jf.boolean().required()
                        signUpForSpam!: boolean;
                    }
                    return MarketingForm;
                };

                const validator = new Validator();
                const result = validator.validateAsClass({}, getForm());

                expect(result.error).toBeTruthy();
                expect(result.error!.message).toContain('signUpForSpam');
            });
        });

        it('should provide method to get the Joi schema for a class', () => {
            class ForgotPassword {
                emailAddress?: string;
            }

            expect(jf.getSchema(ForgotPassword)).toBe(undefined);

            class Login {
                @jf.string().email().required()
                emailAddress?: string;

                @jf.string().min(8).required()
                password?: string;
            }

            expect(jf.getSchema(Login)).toBeTruthy();
        });

        it('should provide method to test if class has a schema', () => {
            class ForgotPassword {
                emailAddress?: string;
            }

            expect(jf.hasSchema(ForgotPassword)).toBe(false);

            class Login {
                @jf.string().email().required()
                emailAddress?: string;

                @jf.string().min(8).required()
                password?: string;
            }

            expect(jf.hasSchema(Login)).toBe(true);
        });
    });
});

describe('validate', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    it('automatically validates arguments passed into a method', () => {
        class Passcode {
            @jf.string().alphanum().exactLength(6)
            code!: string;
        }

        class PasscodeChecker {
            @jf.validateParams()
            check(passcode: Passcode, basicArg: number) {
                expect(passcode).not.toBeNull();
                expect(basicArg).not.toBeNull();
            }
        }

        const passcode = new Passcode();
        passcode.code = 'abc';

        const checker = new PasscodeChecker();
        expect(() => checker.check(passcode, 5)).toThrow(MultipleValidationError);

        passcode.code = 'abcdef';
        checker.check(passcode, 5);
    });

    it('can use a custom validator', () => {
        class Passcode {
            @jf.string().alphanum().exactLength(6)
            code!: string;
        }

        const validator = new Validator();
        jest.spyOn(validator, 'validateAsClass').mockImplementation((value: any) => ({
            error: null,
            errors: null,
            warning: null,
            value,
        }));

        class PasscodeChecker {
            @jf.validateParams({ validator })
            check(passcode: Passcode, basicArg: number) {
                expect(passcode).not.toBeNull();
                expect(basicArg).not.toBeNull();
            }
        }

        const passcode = { code: 'abcdef' };

        const checker = new PasscodeChecker();
        checker.check(passcode, 5);

        expect(validator.validateAsClass).toHaveBeenCalledWith(passcode, Passcode);
    });
});
