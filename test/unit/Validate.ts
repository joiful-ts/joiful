import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
var assert : AssertStatic = chai.assert;
import {Validator} from "../../src/Validator";
import {Length} from "../../src/constraints/string";
import {Validate} from "../../src/Validate";
import {MultipleValidationError} from "../../src/MultipleValidationError";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";

registerJoi(Joi);

describe('Validate', function () {
   it('decorates a target method', function () {
       var validator = new Validator();

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

       var instance = new ClassToValidate();
       instance.myProperty = "abc";

       var outer = new OuterClass();
       assert.throws(function () {
           outer.run(instance, 5);
       }, MultipleValidationError);

       instance.myProperty = "abcde";
       outer.run(instance, 5);
   });
});