import "./metadataShim";
import * as chai from "chai";
import {Validator} from "../../src/Validator";
import {ValidationOptions} from "joi";
import AssertStatic = Chai.AssertStatic;
const assert : AssertStatic = chai.assert;

export function isValid(validator : Validator, object : any) {
    const result = validator.validate(object);
    assert.property(result, "error");
    assert.isNull(result.error, `Validation should pass, but got error: ${ result.error }`);
}

export function isInvalid(validator : Validator, object : any) {
    const result = validator.validate(object);
    assert.property(result, "error");
    assert.isNotNull(result.error, "Validation should fail");
}

export function testConstraint<T>(
    classFactory : () => any,
    valid : T[],
    invalid : T[],
    validationOptions? : ValidationOptions
) {
    const validator = new Validator(validationOptions);

    it("should validate successful candidates", () => {
        const clz = classFactory();
        for (let val of valid) {
            let instance = new clz(val);
            isValid(validator, instance);
        }
    });

    it("should invalidate successful candidates", () => {
        const clz = classFactory();
        for (let val of invalid) {
            let instance = new clz(val);
            isInvalid(validator, instance);
        }
    });
}

export function testConversion<T>(
    classFactory : () => any,
    getter : (object : any) => any,
    converted : T[][],
    unconverted : T[]
) {
    const clz = classFactory();

    it("should modify matching property", () => {
        const validator = new Validator({
            convert: true
        });

        for (const entry of converted) {
            const input = entry[0];
            const expected = entry[1];
            const object = new clz(input);
            const result = validator.validate(object);
            assert.property(result, "error");
            assert.isNull(result.error, "Validation should pass");
            assert.property(result, "value");
            const value = result.value;
            assert.equal(getter(value), expected);
        }
    });

    it("should not modify unmatching property", () => {
        const validator = new Validator({
            convert: true
        });

        for (const input of unconverted) {
            const object = new clz(input);
            const result = validator.validate(object);
            assert.property(result, "error");
            assert.isNull(result.error, "Validation should pass");
            assert.property(result, "value");
            const value = result.value;
            assert.equal(getter(value), input);
        }
    });
}