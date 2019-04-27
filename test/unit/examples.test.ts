import "./metadataShim";
import {Validator} from "../../src/Validator";
import {assertIsValid, assertIsInvalid} from "./testUtil";
import { getJoiSchema, registerJoi } from "../../src/core";
import * as Joi from "joi";
import { Nested, NestedArray } from "../../src/Nested";
import {Length, StringSchema} from "../../src/constraints/string";
import { Keys, ObjectSchema } from "../../src/constraints/object";
import { Lazy, Required } from "../../src/constraints/any";

registerJoi(Joi);

describe('Examples', function () {
    it('class with methods', function () {
        const validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty! : string;

            public myMethod() {

            }
        }

        const instance = new ClassToValidate();
        instance.myProperty = "abcde";

        assertIsValid(validator, instance);

        //instance.myMethod();
    });

    it('class with unvalidated properties', function () {
        const validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty! : string;

            public myOtherProperty! : string;
        }

        const instance = new ClassToValidate();
        instance.myProperty = "abcde";
        instance.myOtherProperty = "abcde";

        assertIsInvalid(validator, instance);
    });

    it('class with static properties', function () {
        const validator = new Validator();

        class ClassToValidate {
            static STATIC_PROPERTY = "bloop";

            @Length(5)
            public myProperty! : string;

        }

        const instance = new ClassToValidate();
        instance.myProperty = "abcde";

        assertIsValid(validator, instance);
    });

    it('nested class', function () {
        const validator = new Validator();

        class InnerClass {
            @StringSchema()
            public innerProperty! : string;
        }

        class ClassToValidate {
            @Nested()
            public myProperty! : InnerClass;
        }

        const instance = new ClassToValidate();
        instance.myProperty = {
            innerProperty: "abcde"
        };

        assertIsValid(validator, instance);

        instance.myProperty.innerProperty = <any> 1234;
        assertIsInvalid(validator, instance);
    });

    it(`a property with a class instance type and an object schema`, function () {
        const validator = new Validator();

        class InnerClass {
            @StringSchema()
            public innerProperty! : string;
        }

        class ClassToValidate {
            @Keys({
                innerProperty: Joi.string()
            })
            @ObjectSchema()
            public myProperty! : InnerClass;
        }

        const instance = new ClassToValidate();
        instance.myProperty = {
            innerProperty: "abcde"
        };

        assertIsValid(validator, instance);

        instance.myProperty.innerProperty = <any> 1234;
        assertIsInvalid(validator, instance);
    });

    it(`lazy evaluation (for recursive data structures)`, function () {
        const validator = new Validator();

        class TreeNode {
            @Required()
            tagName! : string;

            @Lazy(() => Joi.array().items(getJoiSchema(TreeNode)))
            children! : TreeNode[];
        }

        const instance = new TreeNode();
        instance.tagName = 'outer';
        instance.children = [
            {
                tagName: 'inner',
                children: []
            }
        ];

        assertIsValid(validator, instance);
    });
});
