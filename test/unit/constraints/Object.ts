import * as chai from "chai";
var assert : AssertStatic = chai.assert;
import {SCHEMA_KEY} from "../../../src/core";
import AssertStatic = Chai.AssertStatic;
import * as Joi from "joi";
import {ConstraintDefinitionError} from "../../../src/core";
import {Validator} from "../../../src/Validator";

function isValid(validator : Validator, object : any) {
    var result = validator.validate(object);
    assert.property(result, "error");
    assert.isNull(result.error);
}

function isInvalid(validator : Validator, object : any) {
    var result = validator.validate(object);
    assert.property(result, "error");
    assert.isNotNull(result.error);
}

describe("And", function () {
    // TODO
    //class MyClass {
    //    myProperty : string;
    //
    //    constructor(myProperty : string) {
    //        this.myProperty = myProperty;
    //    }
    //}
    //const validator = new Validator();
    //
    //it("should validate successful candidates", function () {
    //    isValid(validator,
    //        new MyClass("abcdEFG12390")
    //    );
    //});
    //
    //it("should validate failing candidates", function () {
    //    isInvalid(validator,
    //        new MyClass("!@#$")
    //    );
    //});
});