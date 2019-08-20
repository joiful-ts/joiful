import './metadataShim';
import './testUtil';
import { getJoiSchema } from '../../src/core';
import * as Joi from 'joi';
import { Joiful } from '../../src/main';

describe('Examples', () => {
    let jf: Joiful;

    beforeEach(() => {
        jf = new Joiful();
    });

    it('class with methods', () => {
        class ClassToValidate {
            @jf.string().exactLength(5)
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
            @jf.string().exactLength(5)
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

            @jf.string().exactLength(5)
            public myProperty!: string;

        }

        const instance = new ClassToValidate();
        instance.myProperty = 'abcde';

        expect(instance).toBeValid();
    });

    it('nested class', () => {
        class InnerClass {
            @jf.string()
            public innerProperty!: string;
        }

        class ClassToValidate {
            @jf.object()
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
            @jf.string().required()
            tagName!: string;

            @jf.lazy(() => Joi.array().items(getJoiSchema(TreeNode)))
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
