import * as chai from "chai";
import {Validator} from "../../src/Validator";
import {Validate} from "../../src/Validate";
import {MultipleValidationError} from "../../src/MultipleValidationError";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";
import {StringConstraints} from "../../src/constraints/string";
import AssertStatic = Chai.AssertStatic;
const assert : AssertStatic = chai.assert;
import Length = StringConstraints.Length;

registerJoi(Joi);

describe('Validate', function () {
   it('decorates a target method', function () {
       const validator = new Validator();

       class ClassToValidate {
           @Length(5)
           myProperty : string;
       }

       class OuterClass {
           @Validate(validator)
           run(arg : ClassToValidate, basicArg : number) {
               assert.isNotNull(arg);
               assert.isNotNull(basicArg);
           }
       }

       const instance = new ClassToValidate();
       instance.myProperty = "abc";

       const outer = new OuterClass();
       assert.throws(function () {
           outer.run(instance, 5);
       }, MultipleValidationError);

       instance.myProperty = "abcde";
       outer.run(instance, 5);
   });
});