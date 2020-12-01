//import { getJoiSchema } from '../../src/core';
import * as Joi from 'joi';
import { Joiful, array, object, string, Validator } from '../../src';
import { testConstraint } from './testUtil';
import { StringSchema } from 'joi';

describe('Examples', () => {
    it('class with methods', () => {
        class ClassToValidate {
            @string().exactLength(5)
            public myProperty!: string;

            public myMethod() {

            }
        }

        const instance = new ClassToValidate();
        instance.myProperty = 'abcde';

        expect(instance).toBeValid();

        //instance.myMethod();
    });

    it('class with unvalidated properties', () => {
        class ClassToValidate {
            @string().exactLength(5)
            public myProperty!: string;

            public myOtherProperty!: string;
        }

        const instance = new ClassToValidate();
        instance.myProperty = 'abcde';
        instance.myOtherProperty = 'abcde';

        expect(instance).not.toBeValid();
    });

    it('class with static properties', () => {
        class ClassToValidate {
            static STATIC_PROPERTY = 'bloop';

            @string().exactLength(5)
            public myProperty!: string;

        }

        const instance = new ClassToValidate();
        instance.myProperty = 'abcde';

        expect(instance).toBeValid();
    });

    it('nested class', () => {
        class InnerClass {
            @string()
            public innerProperty!: string;
        }

        class ClassToValidate {
            @object()
            public myProperty!: InnerClass;
        }

        const instance = new ClassToValidate();
        instance.myProperty = {
            innerProperty: 'abcde',
        };

        expect(instance).toBeValid();

        instance.myProperty.innerProperty = <any>1234;
        expect(instance).not.toBeValid();
    });

    it('link for recursive data structures', () => {
        class TreeNode {
            @string().required()
            tagName!: string;

            // . - the link
            // .. - the children array
            // ... - the TreeNode class
            @array().items((joi) => joi.link('...'))
            children!: TreeNode[];
        }

        const instance = new TreeNode();
        instance.tagName = 'outer';
        instance.children = [
            {
                tagName: 'inner',
                children: [],
            },
        ];

        expect(instance).toBeValid();
    });

    describe('creating your own reusable decorators', () => {
        // Remember you may need to create your own decroators in a separate
        // file to where they are being used, to ensure that they exist before
        // they are ran against your class. In the example below we get around
        // that trap by creating our class in a function, so the decorators
        // execution is delayed until the function gets called

        const password = () => string()
            .min(8)
            .regex(/[a-z]/)
            .regex(/[A-Z]/)
            .regex(/[0-9]/)
            .required();

        testConstraint(
            () => {
                class SetPasswordForm {
                    @password()
                    password!: string;
                }
                return SetPasswordForm;
            },
            [
                { password: 'Password123' },
            ],
            [
                {},
                { password: 'password123' },
                { password: 'PASSWORD123' },
                { password: 'Password' },
                { password: 'Pass123' },
            ],
        );
    });

    /**
     * @see https://hapi.dev/family/joi/api/?v=15.1.1#extendextension
     */
    it('Extending Joi for custom validation', () => {
        // Custom validation functions must be added by using Joi's "extend" mechanism.

        // These are utility types you may find useful to replace the return of a function.
        // These types are derived from: https://stackoverflow.com/a/50014868
        type ReplaceReturnType<T extends (...args: unknown[]) => unknown, TNewReturn> =
            (...a: Parameters<T>) => TNewReturn;

        // We are going to create a new instance of Joi, with our extended functionality: a custom validation
        //  function that checks if each character in a string has "alternating case" (that is, each character has a
        //  case different to those either side of it).

        // For our own peace of mind, we're first going to update the type of the Joi instance to include our new
        //  schema.

        interface ExtendedStringSchema extends StringSchema {
            alternatingCase(): this; // We're adding this method, only for string schemas.
        }

        // Need to alias this, because `interface Foo extends typeof Joi` doesn't work.
        type OriginalJoi = typeof Joi;

        interface CustomJoi extends OriginalJoi {
            // This allows us to use our extended string schema, in place of Joi's original StringSchema.
            // E.g. instead of `Joi.string()` returning `StringSchema`, it now returns `ExtendedStringSchema`.
            string: ReplaceReturnType<OriginalJoi['string'], ExtendedStringSchema>;
        }

        // This is our where we define our custom rule. Please read the Joi documentation for more info.
        // NOTE: we must explicitly provide the type annotation of `CustomJoi`.
        const customJoi: CustomJoi = Joi.extend((joi) => {
            return {
                base: joi.string(), // The base Joi schema
                type: 'string',

                rules: {
                    alternatingCase: {
                        validate(value: string, helpers) {
                            // Your validation implementation would go here.
                            if (value.length < 2) {
                                return true;
                            }
                            let lastCase = null;
                            for (let char of value) {
                                const charIsUppercase = /[A-Z]/.test(char);
                                if (charIsUppercase === lastCase) { // Not alternating case
                                    // Validation failures must return a Joi error.
                                    // You'll need to allow a suspicious use of "this" here, so that we can access the
                                    //  Joi instance's `createError()` method.
                                    // tslint:disable-next-line:no-invalid-this
                                    return helpers.error('string.case');
                                }
                                lastCase = charIsUppercase;
                            }
                            return value;
                        },
                    },
                },
            };
        });

        // This function is how we're going to make use of our custom validator.
        function alternatingCase(options: { schema: Joi.Schema, joi: typeof Joi }): Joi.Schema {
            // (TODO: remove the `as CustomJoi` assertion. Requires making Joiful, JoifulOptions etc generic.)
            return (options.joi as CustomJoi).string().alternatingCase();
        }

        const customJoiful = new Joiful({
            joi: customJoi,
        });

        class ThingToValidate {
            // Note that we must _always_ use our own `customJoiful` for all decorators, instead of importing them
            //  directly from Joiful (e.g. `customJoiful.string()` vs `jf.string()`)
            // Failing to do so means Joiful will use the default instance of Joi, which could cause inconsistent
            //  behaviour, and prevent us from using our custom validator.
            @customJoiful.string().custom(alternatingCase)
            public propertyToValidate: string;

            constructor(
                propertyToValidate: string,
            ) {
                this.propertyToValidate = propertyToValidate;
            }
        }

        // Finally, we need to pass our custom Joi instance to our Validator instance.
        const validator = new Validator({
            joi: customJoi,
        });

        // Execute & verify
        let instance = new ThingToValidate(
            'aBcDeFgH',
        );
        const assertionOptions = { validator };
        expect(instance).toBeValid(assertionOptions);

        instance = new ThingToValidate(
            'AbCdEfGh',
        );
        expect(instance).toBeValid(assertionOptions);

        instance = new ThingToValidate(
            'abcdefgh',
        );
        expect(instance).not.toBeValid(assertionOptions);
    });
});
