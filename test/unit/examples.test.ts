import './metadataShim';
import './testUtil';
import { getJoiSchema, registerJoi } from '../../src/core';
import * as Joi from '@hapi/joi';
import { Nested } from '../../src/Nested';
import { Length, StringSchema } from '../../src/constraints/string';
import { Keys, ObjectSchema } from '../../src/constraints/object';
import { Lazy, Required } from '../../src/constraints/any';

registerJoi(Joi);

describe('Examples', () => {
    it('class with methods', () => {
        class ClassToValidate {
            @Length(5)
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
            @Length(5)
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

            @Length(5)
            public myProperty!: string;

        }

        const instance = new ClassToValidate();
        instance.myProperty = 'abcde';

        expect(instance).toBeValid();
    });

    it('nested class', () => {
        class InnerClass {
            @StringSchema()
            public innerProperty!: string;
        }

        class ClassToValidate {
            @Nested()
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

    it('a property with a class instance type and an object schema', () => {
        class InnerClass {
            @StringSchema()
            public innerProperty!: string;
        }

        class ClassToValidate {
            @Keys({
                innerProperty: Joi.string(),
            })
            @ObjectSchema()
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
            @Required()
            tagName!: string;

            @Lazy(() => Joi.array().items(getJoiSchema(TreeNode)))
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
});
