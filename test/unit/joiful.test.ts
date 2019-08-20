import { testConstraintWithPojos } from './testUtil';
import { Joiful } from '../../src/joiful';
import { Validator, MultipleValidationError } from '../../src/validation';

describe('joiful', () => {
    let jf: Joiful;

    beforeEach(() => {
        jf = new Joiful();
    });

    testConstraintWithPojos(
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
