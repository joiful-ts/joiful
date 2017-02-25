import {Validator} from "../../src/Validator";
import {isValid, isInvalid} from "./testUtil";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";
import {Nested} from "../../src/Nested";
import {StringConstraints} from "../../src/constraints/string";
import AssertStatic = Chai.AssertStatic;
import Length = StringConstraints.Length;
import StringSchema = StringConstraints.StringSchema;

registerJoi(Joi);

describe('Examples', function () {
    it('class with methods', function () {
        const validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty : string;

            public myMethod() {

            }
        }

        const instance = new ClassToValidate();
        instance.myProperty = "abcde";

        isValid(validator, instance);

        //instance.myMethod();
    });

    it('class with unvalidated properties', function () {
        const validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty : string;

            public myOtherProperty : string;
        }

        const instance = new ClassToValidate();
        instance.myProperty = "abcde";
        instance.myOtherProperty = "abcde";

        isInvalid(validator, instance);
    });

    it('class with static properties', function () {
        const validator = new Validator();

        class ClassToValidate {
            static STATIC_PROPERTY = "bloop";

            @Length(5)
            public myProperty : string;

        }

        const instance = new ClassToValidate();
        instance.myProperty = "abcde";

        isValid(validator, instance);
    });

    it('nested class', function () {
        const validator = new Validator();

        class InnerClass {
            @StringSchema()
            public innerProperty : string;
        }

        class ClassToValidate {
            @Nested()
            public myProperty : InnerClass;
        }

        const instance = new ClassToValidate();
        instance.myProperty = {
            innerProperty: "abcde"
        };

        isValid(validator, instance);

        instance.myProperty.innerProperty = <any> 1234;
        isInvalid(validator, instance);
    });
});