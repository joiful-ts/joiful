import '../metadataShim';
import { registerJoi } from '../../../src/core';
import * as Joi from '@hapi/joi';
import { testConstraint } from '../testUtil';
import { Concat, Empty, Required } from '../../../src/constraints/any';
import { StringSchema } from '../../../src/constraints/string';
import { AnyConstraints, Validator } from '../../../src/main';

registerJoi(Joi);

describe('Any constraints', () => {
    describe('Concat', () => {
        describe('should merge the rules of another schema into this one', () => {
            testConstraint<string>(
                () => {
                    const emailSchema = Joi.string().email();
                    class ForgotPasswordForm {
                        @Concat(emailSchema)
                        @StringSchema()
                        emailAddress?: string;

                        constructor(emailAddress?: string) {
                            this.emailAddress = emailAddress;
                        }
                    }
                    return ForgotPasswordForm;
                },
                ['valid@example.com'],
                ['invalid'],
            );
        });
    });

    describe('Empty', () => {
        describe('should consider anything that matches the given value/schema to be empty', () => {
            testConstraint<string>(
                () => {
                    class ForgotPasswordForm {
                        @Required()
                        @Empty('')
                        emailAddress?: string;

                        constructor(emailAddress?: string) {
                            this.emailAddress = emailAddress;
                        }
                    }
                    return ForgotPasswordForm;
                },
                ['valid'],
                [''],
            );
        });
    });

    describe('Error', () => {
        it('should return custom error instance when the decorator appears above other decorators', () => {
            // Set up
            class MyError extends Error {
            }

            const errorToReturn = new MyError('My custom error message will go here');

            class DataToValidate {
                @AnyConstraints.Error(errorToReturn)
                public foo!: string;
            }

            // Execute
            let result = new Validator().validateAsClass({
                foo: 1,
            }, DataToValidate);

            // Verify
            expect(result.error).toBe(errorToReturn); // should be the same error object
        });
    });
});
