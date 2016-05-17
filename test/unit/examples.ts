import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
var assert : AssertStatic = chai.assert;
import {Validator} from "../../src/Validator";
import {Length} from "../../src/constraints/string";
import {isValid} from "./testUtil";
import {isInvalid} from "./testUtil";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";

registerJoi(Joi);

describe('Examples', function () {
    it('class with methods', function () {
        var validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty : string;

            public myMethod() {

            }
        }

        var instance = new ClassToValidate();
        instance.myProperty = "abcde";

        isValid(validator, instance);
    });

    it('class with unvalidated properties', function () {
        var validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty : string;

            public myOtherProperty : string;
        }

        var instance = new ClassToValidate();
        instance.myProperty = "abcde";
        instance.myOtherProperty = "abcde";

        isInvalid(validator, instance);
    });

    it('class with static properties', function () {
        var validator = new Validator();

        class ClassToValidate {
            static STATIC_PROPERTY = "bloop";

            @Length(5)
            public myProperty : string;

        }

        var instance = new ClassToValidate();
        instance.myProperty = "abcde";

        isValid(validator, instance);
    });
});