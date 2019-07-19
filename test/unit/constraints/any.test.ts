import '../metadataShim';
import { registerJoi, WORKING_SCHEMA_KEY } from '../../../src/core';
import * as Joi from 'joi';
import { testConstraint, testConstraintWithPojos } from '../testUtil';
import {
    Allow,
    AnySchema,
    Concat,
    Default,
    Description,
    Empty,
    Example,
    Forbidden,
    Invalid,
    Label,
    Meta,
    Notes,
    Optional,
    Options,
    Raw,
    Required,
    Strip,
    Tags,
    Unit,
    Valid,
} from '../../../src/constraints/any';
import { BooleanSchema } from '../../../src/constraints/boolean';
import { StringSchema } from '../../../src/constraints/string';
import { AnyConstraints, Validator } from '../../../src/main';
import { DateSchema } from '../../../src/constraints/date';

registerJoi(Joi);

describe('Any constraints', () => {
    describe('Allow', () => {
        testConstraintWithPojos(
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
                    @Allow(...allowedValues)
                    @BooleanSchema()
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

    describe('AnySchema', () => {
        class Datum {
            @AnySchema()
            value?: any;
        }

        it('should annotate the class property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, Datum.prototype);
            const expected = {
                value: Joi.any(),
            };
            expect(metadata).toEqual(expected);
        });

        describe('when using fluent API', () => {
            class Datum {
                @AnySchema((schema) => schema.required())
                value?: any;
            }

            testConstraintWithPojos(
                () => Datum,
                [
                    { value: 'hello' },
                    { value: true },
                    { value: false },
                    { value: 1 },
                    { value: 0 },
                    { value: new Date() },
                ],
                [{}],
            );
        });
    });

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

    describe('Default', () => {
        it('should set a default value if actual value is undefined', () => {
            type Sauce = 'tomato' | 'bbq' | 'special';

            class PizzaOrderSauceSelection {
                @Default('tomato')
                @StringSchema()
                sauce?: Sauce;
            }

            const validator = new Validator();

            let sauceSelection = validator.validateAsClass({}, PizzaOrderSauceSelection);
            expect(sauceSelection.value).toEqual({ sauce: 'tomato' });

            sauceSelection = validator.validateAsClass({ sauce: 'bbq' }, PizzaOrderSauceSelection);
            expect(sauceSelection.value).toEqual({ sauce: 'bbq' });
        });
    });

    describe('Description', () => {
        it('should annotate property with description', () => {
            const pineappleDescription = 'Wether you want pineapple on your pizza. We will not judge you.';

            class PizzaOrder {
                @Description('Wether you want pineapple on your pizza. We will not judge you.')
                pineapple?: boolean;
            }

            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, PizzaOrder.prototype);
            const expected = {
                pineapple: Joi.boolean().description(pineappleDescription),
            };
            expect(metadata).toEqual(expected);
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

    describe('Example', () => {
        it('should annotate property with example value', () => {
            const exampleCatName = 'Sir. Meowsalot The Second';

            class CatAdoptionForm {
                @Example(exampleCatName)
                catName?: string;
            }

            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, CatAdoptionForm.prototype);
            const expected = {
                catName: Joi.string().example(exampleCatName),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Forbidden', () => {
        testConstraintWithPojos(
            () => {
                class UpdateUser {
                    @StringSchema()
                    id?: string;

                    @StringSchema()
                    emailAddress?: string;

                    name?: string;

                    @Forbidden()
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

    describe('Invalid', () => {
        testConstraintWithPojos(
            () => {
                class SignUpForm {
                    @StringSchema()
                    username?: string;

                    @Invalid('password', 'Password')
                    @StringSchema()
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

    describe('Label', () => {
        class LoginForm {
            @Label('Username')
            username?: string;

            @Label('Password')
            password?: string;

            @Label('Keep me logged in')
            rememberMe?: boolean;
        }

        it('should associate a label with the property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, LoginForm.prototype);
            const expected = {
                username: Joi.string().label('Username'),
                password: Joi.string().label('Password'),
                rememberMe: Joi.boolean().label('Keep me logged in'),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Meta', () => {
        class User {
            @Meta('some metadata')
            name?: string;
        }

        it('should associate a label with the property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, User.prototype);
            const expected = {
                name: Joi.string().meta('some metadata'),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Notes', () => {
        class User {
            @Notes('some notes')
            name?: string;
        }

        it('should associate notes with the property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, User.prototype);
            const expected = {
                name: Joi.string().notes('some notes'),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Optional', () => {
        testConstraintWithPojos(
            () => {
                class User {
                    @StringSchema()
                    emailAddress!: string;

                    @Optional()
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

    describe('Options', () => {
        class User {
            @Options({ presence: 'required' })
            name!: string;
        }

        it('should override validation options for the property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, User.prototype);
            const expected = {
                name: Joi.string().options({ presence: 'required' }),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Raw', () => {
        it('should coerce input value for property when not using raw', () => {
            class AgeVerification {
                @Raw(false)
                age!: number;
            }

            const validator = new Validator();
            const result = validator.validateAsClass({ age: '30' }, AgeVerification);
            expect(result.value.age).toBe(30);
        });

        it('should not coerce input value for property', () => {
            class RawAgeVerification {
                @Raw()
                age!: number;
            }

            const validator = new Validator();
            const result = validator.validateAsClass({ age: '30' }, RawAgeVerification);
            expect(result.value.age).toBe('30');
        });
    });

    describe('Required', () => {
        testConstraintWithPojos(
            () => {
                class User {
                    @Required()
                    @StringSchema()
                    emailAddress!: string;

                    @DateSchema()
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

    describe('Strip', () => {
        it('should strip out the property', () => {

            class UpdateUser {
                @StringSchema()
                id!: string;

                @StringSchema()
                emailAddress!: string;

                @Strip()
                @StringSchema()
                password?: string;
            }

            const validator = new Validator();

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

    describe('Tags', () => {
        it('should associate tags with the property', () => {
            class User {
                @Tags('identity')
                id!: string;

                @Tags('identity', 'authentication')
                emailAddress!: string;

                @Tags('authentication')
                password!: string;
            }

            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, User.prototype);
            const expected = {
                id: Joi.string().tags('identity'),
                emailAddress: Joi.string().tags(['identity', 'authentication']),
                password: Joi.string().tags('authentication'),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Unit', () => {
        it('should associate tags with the property', () => {
            class Circle {
                @Unit('millimetres')
                radius!: number;
            }

            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, Circle.prototype);
            const expected = {
                radius: Joi.number().unit('millimetres'),
            };
            expect(metadata).toEqual(expected);
        });
    });

    describe('Valid', () => {
        testConstraintWithPojos(
            () => {
                const colorChannels = [
                    'red',
                    'green',
                    'blue',
                ] as const;

                type ColorChannel = typeof colorChannels[number];

                class ColorChannelAdjustment {
                    @Valid(...colorChannels)
                    @StringSchema()
                    channel?: ColorChannel;
                }

                return ColorChannelAdjustment;
            },
            [
                {},
                { channel: 'red' },
                { channel: 'green' },
                { channel: 'blue' },
            ],
            [
                { channel: 'pink' as any },
            ],
        );
    });
});
