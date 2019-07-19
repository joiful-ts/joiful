import './metadataShim';
import { Validator } from '../../src/Validator';
import { ValidationOptions } from '@hapi/joi';

interface ToBeValidOptions {
    clz?: { new(...args: any[]): any };
    validator?: Validator;
}

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValid(options?: ToBeValidOptions): void;
        }

        interface Expect {
            toBeValid(options?: ToBeValidOptions): void;
        }
    }
}

const tryToStringify = (value: any) => {
    try {
        return JSON.stringify(value, null, '  ');
    } catch (err) {
        return null;
    }
};

expect.extend({
    toBeValid(candidate: any, options: ToBeValidOptions) {
        const validator = (options && options.validator) || new Validator();
        const clz = options && options.clz;
        const result = clz ?
            validator.validateAsClass(candidate, clz) :
            validator.validate(candidate);

        const pass = result.error === null;
        // tslint:disable-next-line:no-invalid-this
        const isNot = this.isNot;

        const candidateAsString = tryToStringify(candidate);

        const message =
            `expected candidate to ${isNot ? 'fail' : 'pass'} validation` +
            (!candidateAsString ? '' : `:\n\n  ${candidateAsString.replace(/\n/gm, '\n  ')}`);

        return {
            pass,
            message: () => message,
        };
    },
});

export interface AssertValidationOptions<T> {
    clz?: { new(...args: any[]): T };
    object: T;
    validator?: Validator;
}

export function testConstraint<T>(
    classFactory: () => any,
    valid: T[],
    invalid: T[],
    validationOptions?: ValidationOptions,
) {
    const validator = new Validator(validationOptions);

    it('should validate successful candidates', () => {
        const clz = classFactory();
        for (let val of valid) {
            let instance = new clz(val);
            expect(instance).toBeValid({ validator });
        }
    });

    it('should invalidate unsuccessful candidates', () => {
        const clz = classFactory();
        for (let val of invalid) {
            let instance = new clz(val);
            expect(instance).not.toBeValid({ validator });
        }
    });
}

export function testConstraintWithPojos<T>(
    classFactory: () => { new(...args: any[]): T },
    valid: T[],
    invalid: T[],
    validationOptions?: ValidationOptions,
) {
    const validator = new Validator(validationOptions);

    it('should validate successful candidates', () => {
        // tslint:disable-next-line: no-inferred-empty-object-type
        const clz = classFactory();
        for (let val of valid) {
            expect(val).toBeValid({ validator, clz });
        }
    });

    it('should invalidate unsuccessful candidates', () => {
        // tslint:disable-next-line: no-inferred-empty-object-type
        const clz = classFactory();
        for (let val of invalid) {
            expect(val).not.toBeValid({ validator, clz });
        }
    });
}

export function testConversion<T>(
    classFactory: () => any,
    getter: (object: any) => any,
    converted: T[][],
    unconverted: T[],
) {
    const clz = classFactory();

    it('should modify matching property', () => {
        const validator = new Validator({
            convert: true,
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

    it('should not modify unmatching property', () => {
        const validator = new Validator({
            convert: true,
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
