import '../metadataShim';
import { registerJoi } from '../../../src/core';
import * as Joi from 'joi';
import { testConstraint } from '../testUtil';
import { Concat, Empty, Required } from '../../../src/constraints/any';
import { StringSchema } from '../../../src/constraints/string';

registerJoi(Joi);

describe('Any constraints', () => {
    describe('Concat', () => {
        it('should merge the rules of another schema into this one', () => {
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
                ['invalid']
            );
        });
    });

    describe('Empty', () => {
        it('should consider anything that matches the given value/schema to be empty', () => {
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
                ['']
            );
        });
    });
});
