import "./metadataShim";
import {Validator} from "../../src/Validator";
import {ValidationOptions} from "joi";
import {
    isValidationFail, isValidationPass, ValidationResultFail,
    ValidationResultPass
} from "../../src/ValidationResult";

export function assertIsValid<T = any>(validator : Validator, object : T) {
    const result = validator.validate<T>(object);
    expect(result).toHaveProperty('error');
    expect(result.error).toBeNull();
}

export function assertIsInvalid<T = any>(validator : Validator, object : T) {
    const result = validator.validate<T>(object);
    expect(result).toHaveProperty('error');
    expect(result.error).toBeTruthy()
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
            assertIsValid(validator, instance);
        }
    });

    it("should invalidate successful candidates", () => {
        const clz = classFactory();
        for (let val of invalid) {
            let instance = new clz(val);
            assertIsInvalid(validator, instance);
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
            expect(result).toHaveProperty('error');
            expect(result.error).toBeNull();
            expect(result).toHaveProperty('value');
            expect(getter(result.value)).toEqual(expected);
        }
    });

    it("should not modify unmatching property", () => {
        const validator = new Validator({
            convert: true
        });

        for (const input of unconverted) {
            const object = new clz(input);
            const result = validator.validate(object);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeNull();
            expect(result).toHaveProperty('value');
            expect(getter(result.value)).toEqual(input);
        }
    });
}