import * as Joi from '@hapi/joi';
import { testConstraint, assertClassSchemaEquals } from '../testUtil';
import * as jf from '../../../src';
import { getJoiSchema } from '../../../src/core';
import { Validator, isValidationPass } from '../../../src/validation';
import { NotImplemented } from '../../../src/decorators/common';

describe('any', () => {
    testConstraint(
        () => {
            class KeyValuePair {
                @jf.string().required()
                key!: string;

                @jf.any().required()
                value!: any;
            }
            return KeyValuePair;
        },
        [
            {
                key: 'NODE_ENV',
                value: 'production',
            },
            {
                key: 'INSTANCE_COUNT',
                value: 5,
            },
            {
                key: 'DEBUG_ENABLED',
                value: false,
            },
        ],
    );

    describe('allow', () => {
        testConstraint(
            () => {
                const allowedValues = [
                    true,
                    false,
                    1,
                    0,
                    'y',
                    'Y',
                    'n',
                    'N',
                    'yeppers',
                ] as const;

                type Booleany = typeof allowedValues[number];

                class EngineOptions {
                    @jf.boolean().allow(...allowedValues)
                    turboMode?: Booleany;
                }

                return EngineOptions;
            },
            [
                {},
                { turboMode: true },
                { turboMode: false },
                { turboMode: 1 },
                { turboMode: 0 },
                { turboMode: 'y' },
                { turboMode: 'Y' },
                { turboMode: 'n' },
                { turboMode: 'N' },
                { turboMode: 'yeppers' },
            ],
            [
                { turboMode: 'fo shizzle my nizzle' as any },
                { turboMode: 9000 },
            ],
        );
    });

    describe('default', () => {
        it('should set a default value if actual value is undefined', () => {
            type Sauce = 'tomato' | 'bbq' | 'special';

            class PizzaOrderSauceSelection {
                @jf.string().default('tomato')
                sauce?: Sauce;
            }

            const validator = new jf.Validator();

            let result = validator.validateAsClass({}, PizzaOrderSauceSelection);
            expect(result.value).toEqual({ sauce: 'tomato' });

            result = validator.validateAsClass({ sauce: 'bbq' }, PizzaOrderSauceSelection);
            expect(result.value).toEqual({ sauce: 'bbq' });
        });
    });

    describe('description', () => {
        it('should annotate property with description', () => {
            const pineappleDescription = 'Whether you want pineapple on your pizza. We will not judge you.';

            class PizzaOrder {
                @jf.boolean().description('Whether you want pineapple on your pizza. We will not judge you.')
                pineapple?: boolean;
            }

            const metadata = getJoiSchema(PizzaOrder, jf.joi);
            const expected = jf.joi.object({
                pineapple: jf.joi.boolean().description(pineappleDescription),
            });
            expect(Object.keys(metadata!)).toEqual(Object.keys(expected));
        });
    });

    describe('empty', () => {
        testConstraint(
            () => {
                class Person {
                    @jf.string().required()
                    name!: string;
                }
                return Person;
            },
            [
                { name: 'Joe' },
                { name: ' ' },
            ],
            [
                {},
            ],
        );

        testConstraint(
            () => {
                class Person {
                    @jf.string().empty(' ').required()
                    name!: string;
                }
                return Person;
            },
            [
                { name: 'Joe' },
            ],
            [
                {},
                { name: ' ' },
            ],
        );
    });

    describe('error', () => {
        it('should provide a custom error when validation fails', () => {
            class DomainNameRegistration {
                @jf.string().error(new Error('Computer says no'))
                domainName!: string;
            }

            const validator = new Validator();
            const valid = validator.validateAsClass({ domainName: 'hotmums.gov' }, DomainNameRegistration);

            expect(isValidationPass(valid)).toBe(true);

            const invalid = validator.validateAsClass({ domainName: 1 }, DomainNameRegistration);
            expect(invalid.error).toEqual(new Error('Computer says no'));
        });

        it('should throw NotImplementedError if joi does not support custom errors', () => {
            const disableCustomErrorsForSchema = ({ schema }: { schema: Joi.Schema }) => {
                const { error, ...newSchema } = schema;
                return newSchema as Joi.Schema;
            };

            function getClass() {
                class DomainNameRegistration {
                    @jf.string().custom(disableCustomErrorsForSchema).error(new Error('Computer says no'))
                    domainName!: string;
                }
                return DomainNameRegistration;
            }

            expect(getClass).toThrowError(new NotImplemented('Joi.error'));
        });
    });

    describe('example', () => {
        it('should annotate property with example value', () => {
            const exampleCatName = 'Sir. Meowsalot The 2nd';

            class CatAdoptionForm {
                @jf.string().example(exampleCatName)
                catName?: string;
            }

            const metadata = getJoiSchema(CatAdoptionForm, jf.joi);
            const expected = jf.joi.object().keys({
                catName: jf.joi.string().example(exampleCatName),
            });
            expect(Object.keys(metadata!)).toEqual(Object.keys(expected));
        });
    });

    describe('forbidden', () => {
        testConstraint(
            () => {
                class UpdateUser {
                    @jf.string()
                    id?: string;

                    @jf.string()
                    emailAddress?: string;

                    name?: string;

                    @jf.boolean().forbidden()
                    isAdmin?: boolean;
                }

                return UpdateUser;
            },
            [
                { id: '1', emailAddress: 'alice@example.com', name: 'Alice' },
                { id: '2', emailAddress: 'bob@example.com', name: 'Bob' },
            ],
            [
                { id: '1', emailAddress: 'joeyjoejoe@example.com', isAdmin: true },
            ],
            { allowUnknown: true },
        );
    });

    function describeInvalidTest(alias: 'invalid' | 'disallow' | 'not') {
        describe(alias, () => {
            type Invalid = ReturnType<typeof jf.string>['invalid'];

            testConstraint(
                () => {
                    class SignUpForm {
                        @jf.string()
                        username?: string;

                        @(jf.string()[alias] as Invalid)('password', 'Password')
                        password?: string;
                    }

                    return SignUpForm;
                },
                [
                    {
                        username: 'hugh@hackman.com',
                        password: '$w0rdF1$h',
                    },
                ],
                [
                    {
                        username: 'bob@example.com',
                        password: 'password',
                    },
                    {
                        username: 'bob@example.com',
                        password: 'Password',
                    },
                ],
            );
        });
    }

    describeInvalidTest('invalid');
    describeInvalidTest('disallow');
    describeInvalidTest('not');

    describe('label', () => {
        class LoginForm {
            @jf.string().label('Username')
            username?: string;

            @jf.string().label('Password')
            password?: string;

            @jf.boolean().label('Keep me logged in')
            rememberMe?: boolean;
        }

        it('should associate a label with the property', () => {
            assertClassSchemaEquals({
                Class: LoginForm,
                expectedSchemaMap: {
                    username: jf.joi.string().label('Username'),
                    password: jf.joi.string().label('Password'),
                    rememberMe: jf.joi.boolean().label('Keep me logged in'),
                },
            });
        });
    });

    describe('meta', () => {
        class User {
            @jf.string().meta({ value: 'some metadata' })
            name?: string;
        }

        it('should associate a label with the property', () => {
            assertClassSchemaEquals({
                Class: User,
                expectedSchemaMap: {
                    name: jf.joi.string().meta({ value: 'some metadata' }),
                },
            });
        });
    });

    describe('notes', () => {
        class User {
            @jf.string().note('some notes')
            name?: string;
        }

        it('should associate notes with the property', () => {
            assertClassSchemaEquals({
                Class: User,
                expectedSchemaMap: {
                    name: jf.joi.string().note('some notes'),
                },
            });
        });
    });

    describe('optional', () => {
        testConstraint(
            () => {
                class User {
                    @jf.string()
                    emailAddress?: string;

                    @jf.date().optional()
                    dateOfBirth?: Date;
                }

                return User;
            },
            [
                { emailAddress: 'alice@example.com', dateOfBirth: new Date() },
                { emailAddress: 'bob@example.com' },
            ],
            [{}],
            { presence: 'required' },
        );
    });

    describe('options', () => {
        class User {
            @jf.string().options({ presence: 'required' })
            name!: string;
        }

        it('should override validation options for the property', () => {
            assertClassSchemaEquals({
                Class: User,
                expectedSchemaMap: {
                    name: jf.joi.string().options({ presence: 'required' }),
                },
            });
        });
    });

    describe('raw', () => {
        it('should coerce input value for property when not using raw', () => {
            class AgeVerification {
                @jf.number().raw(false)
                age!: number;
            }

            const validator = new jf.Validator();
            const result = validator.validateAsClass({ age: '30' }, AgeVerification);
            expect(result.value.age).toBe(30);
        });

        it('should not coerce input value for property', () => {
            class RawAgeVerification {
                @jf.number().raw()
                age!: number;
            }

            const validator = new jf.Validator();
            const result = validator.validateAsClass({ age: '30' }, RawAgeVerification);
            expect(result.value.age).toBe('30');
        });
    });

    describe('required', () => {
        testConstraint(
            () => {
                class User {
                    @jf.string().required()
                    emailAddress?: string;

                    @jf.date()
                    dateOfBirth?: Date;
                }

                return User;
            },
            [
                { emailAddress: 'alice@example.com', dateOfBirth: new Date() },
                { emailAddress: 'bob@example.com' },
            ],
            [{}],
            { presence: 'optional' },
        );
    });

    describe('strip', () => {
        it('should strip out the property', () => {
            class UpdateUser {
                @jf.string()
                id!: string;

                @jf.string()
                emailAddress!: string;

                @jf.string().strip()
                password?: string;
            }

            const validator = new jf.Validator();

            const input: UpdateUser = {
                id: '1',
                emailAddress: 'hugh@hackman.com',
                password: '$w0rdF1$h',
            };

            const output = validator.validateAsClass(input, UpdateUser);

            expect(output.value).toEqual({
                id: '1',
                emailAddress: 'hugh@hackman.com',
            });
        });
    });

    describe('tags', () => {
        it('should associate tags with the property', () => {
            class User {
                @jf.string().tag('identity')
                id!: string;

                @jf.string().tag('identity', 'authentication')
                emailAddress!: string;

                @jf.string().tag(['authentication'])
                password!: string;
            }

            assertClassSchemaEquals({
                Class: User,
                expectedSchemaMap: {
                    id: jf.joi.string().tag('identity'),
                    emailAddress: jf.joi.string().tag('identity', 'authentication'),
                    password: jf.joi.string().tag('authentication'),
                },
            });
        });
    });

    describe('unit', () => {
        it('should associate tags with the property', () => {
            class Circle {
                @jf.number().unit('millimetres')
                radius!: number;
            }

            assertClassSchemaEquals({
                Class: Circle,
                expectedSchemaMap: {
                    radius: jf.joi.number().unit('millimetres'),
                },
            });
        });
    });

    describe('valid', () => {
        const sauces = ['tomato', 'barbeque', 'bechamel'] as const;
        type Sauce = typeof sauces[number];
        testConstraint(
            () => {
                class PizzaSauceSelection {
                    @jf.string().valid(sauces)
                    sauce!: Sauce;
                }
                return PizzaSauceSelection;
            },
            [
                {},
                { sauce: 'tomato' },
                { sauce: 'barbeque' },
                { sauce: 'bechamel' },
            ],
            [
                { sauce: 'mayonaise' },
            ],
        );

        testConstraint(
            () => {
                class PizzaSauceSelection {
                    @jf.string().valid(...sauces)
                    sauce!: Sauce;
                }
                return PizzaSauceSelection;
            },
            [
                {},
                { sauce: 'tomato' },
                { sauce: 'barbeque' },
                { sauce: 'bechamel' },
            ],
            [
                { sauce: 'mayonaise' },
            ],
        );
    });

    describe('only', () => {
        const sauces = ['tomato', 'barbeque', 'bechamel'] as const;
        type Sauce = typeof sauces[number];
        testConstraint(
            () => {
                class PizzaSauceSelection {
                    @jf.string().allow(sauces).only()
                    sauce!: Sauce;
                }
                return PizzaSauceSelection;
            },
            [
                {},
                { sauce: 'tomato' },
                { sauce: 'barbeque' },
                { sauce: 'bechamel' },
            ],
            [
                { sauce: 'mayonaise' },
            ],
        );

        testConstraint(
            () => {
                class PizzaSauceSelection {
                    @jf.string().allow(...sauces).only()
                    sauce!: Sauce;
                }
                return PizzaSauceSelection;
            },
            [
                {},
                { sauce: 'tomato' },
                { sauce: 'barbeque' },
                { sauce: 'bechamel' },
            ],
            [
                { sauce: 'mayonaise' },
            ],
        );
    });

    describe('equal', () => {
        const sauces = ['tomato', 'barbeque', 'bechamel'] as const;
        type Sauce = typeof sauces[number];
        testConstraint(
            () => {
                class PizzaSauceSelection {
                    @jf.string().equal(sauces)
                    sauce!: Sauce;
                }
                return PizzaSauceSelection;
            },
            [
                {},
                { sauce: 'tomato' },
                { sauce: 'barbeque' },
                { sauce: 'bechamel' },
            ],
            [
                { sauce: 'mayonaise' },
            ],
        );

        testConstraint(
            () => {
                class PizzaSauceSelection {
                    @jf.string().equal(...sauces)
                    sauce!: Sauce;
                }
                return PizzaSauceSelection;
            },
            [
                {},
                { sauce: 'tomato' },
                { sauce: 'barbeque' },
                { sauce: 'bechamel' },
            ],
            [
                { sauce: 'mayonaise' },
            ],
        );
    });
});
