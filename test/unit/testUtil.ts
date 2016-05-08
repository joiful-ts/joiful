import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
import {Validator} from "../../src/Validator";
var assert : AssertStatic = chai.assert;

export function isValid(validator : Validator, object : any) {
    var result = validator.validate(object);
    assert.property(result, "error");
    assert.isNull(result.error, "Validation should pass");
}

export function isInvalid(validator : Validator, object : any) {
    var result = validator.validate(object);
    assert.property(result, "error");
    assert.isNotNull(result.error, "Validation should fail");
}
