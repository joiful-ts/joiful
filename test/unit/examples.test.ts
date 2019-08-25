import { getJoiSchema } from '../../src/core';
import * as Joi from 'joi';
import { joi, lazy, object, string } from '../../src';
import { testConstraint } from './testUtil';

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

    it('lazy evaluation (for recursive data structures)', () => {
        class TreeNode {
            @string().required()
            tagName!: string;

            @lazy(() => Joi.array().items(getJoiSchema(TreeNode, joi)))
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
});
