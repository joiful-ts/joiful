import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
import {Validator} from "../../src/Validator";
var assert : AssertStatic = chai.assert;

export function isValid(validator : Validator, object : any) {
    const result = validator.validate(object);
    assert.property(result, "error");
    assert.isNull(result.error, "Validation should pass");
}

export function isInvalid(validator : Validator, object : any) {
    const result = validator.validate(object);
    assert.property(result, "error");
    assert.isNotNull(result.error, "Validation should fail");
}

export function testConstraint<T>(
    classFactory : () => any,
    valid : T[],
    invalid : T[]
) {
    const validator = new Validator();

    it("should validate successful candidates", () => {
        var clz = classFactory();
        for (let val of valid) {
            let instance = new clz(val);
            isValid(validator, instance);
        }
    });

    it("should invalidate successful candidates", () => {
        var clz = classFactory();
        for (let val of invalid) {
            let instance = new clz(val);
            isInvalid(validator, instance);
        }
    });
}