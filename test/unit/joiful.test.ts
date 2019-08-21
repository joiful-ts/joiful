import { testConstraint } from './testUtil';
import { Joiful, string, boolean } from '../../src';
import { Validator, MultipleValidationError } from '../../src/validation';
import * as Case from 'case';

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

        describe('and specifying a label provider', () => {
            jf = new Joiful({
                labelProvider: (propertyKey) => Case.sentence(`${propertyKey}`),
            });

            class MarketingForm {
                @jf.boolean().required()
                signUpForSpam!: boolean;
            }

            it('should use the label provider to generate property labels', () => {
                const validator = new Validator();
                const result = validator.validateAsClass({}, MarketingForm);

                expect(result.error).toBeTruthy();
                expect(result.error!.message).toContain('Sign up for spam');
                expect(result.error!.message).not.toContain('signUpForSpam');
            });

            class AnotherMarketingForm {
                @boolean().required()
                signUpForSpam!: boolean;
            }

            it('should not effect labels of classes decorated using Joiful default instance decorators', () => {
                const validator = new Validator();
                const result = validator.validateAsClass({}, AnotherMarketingForm);

                expect(result.error).toBeTruthy();
                expect(result.error!.message).not.toContain('Sign up for spam');
                expect(result.error!.message).toContain('signUpForSpam');
            });
        });
    });

    describe('validate', () => {
        let jf: Joiful;

        beforeEach(() => jf = new Joiful());

        it('decorates a target method', () => {
            const validator = new Validator();

            class Verification {
                @jf.string().alphanum().exactLength(6)
                code!: string;
            }

            class VerificationChecker {
                @jf.validate({ validator })
                check(verification: Verification, basicArg: number) {
                    expect(verification).not.toBeNull();
                    expect(basicArg).not.toBeNull();
                }
            }

            const verification = new Verification();
            verification.code = 'abc';

            const checker = new VerificationChecker();
            expect(() => checker.check(verification, 5)).toThrow(MultipleValidationError);

            verification.code = 'abcdef';
            checker.check(verification, 5);
        });
    });
});
