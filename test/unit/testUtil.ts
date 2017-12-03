import "./metadataShim";
import {assert} from "chai";
import {Validator} from "../../src/Validator";
import {ValidationOptions} from "joi";
import {
    isValidationFail, isValidationPass, ValidationResultFail,
    ValidationResultPass
} from "../../src/ValidationResult";

export function isValid<T = any>(validator : Validator, object : T) : ValidationResultPass<T> {
    const result = validator.validate<T>(object);
    assert.property(result, "error");
    if (isValidationFail(result)) {
        throw assert.isNull(result.error, `Validation should pass, but got error: ${ result.error }`);
    }
    return result;
}

export function isInvalid<T = any>(validator : Validator, object : T) : never | ValidationResultFail<T> {
    const result = validator.validate<T>(object);
    assert.property(result, "error");
    if (isValidationPass(result)) {
        throw assert.isNotNull(result.error, "Validation should fail");
    } else {
        return result;
    }
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