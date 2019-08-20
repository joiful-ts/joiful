import './metadataShim';
import { Validator } from '../../src/validation';
import { ValidationOptions } from 'joi';

interface ToBeValidOptions {
    Class?: { new(...args: any[]): any };
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
        const Class = options && options.Class;
        const result = Class ?
            validator.validateAsClass(candidate, Class) :
            validator.validate(candidate);

        const pass = result.error === null;
        // tslint:disable-next-line:no-invalid-this
        const isNot = this.isNot;
        const errorMessage = result.error && (result.error.message || result.error);

        const candidateAsString = tryToStringify(candidate);

        const message =
            `expected candidate to ${isNot ? 'fail' : 'pass'} validation` +
            (!candidateAsString ? '' : `:\n\n  ${candidateAsString.replace(/\n/gm, '\n  ')}\n\n${errorMessage}`.trim());

        return {
            pass,
            message: () => message,
        };
    },
});

export interface AssertValidationOptions<T> {
    Class?: { new(...args: any[]): T };
    object: T;
    validator?: Validator;
}

export function testConstraint<T>(
    classFactory: () => { new(...args: any[]): T },
    valid: T[],
    invalid?: T[],
    validationOptions?: ValidationOptions,
) {
    const validator = new Validator(validationOptions);

    it('should validate successful candidates', () => {
        // tslint:disable-next-line: no-inferred-empty-object-type
        const Class = classFactory();
        for (let val of valid) {
            expect(val).toBeValid({ validator, Class: Class });
        }
    });

    if (invalid && invalid.length) {
        it('should invalidate unsuccessful candidates', () => {
            // tslint:disable-next-line: no-inferred-empty-object-type
            const Class = classFactory();
            for (let val of invalid) {
                expect(val).not.toBeValid({ validator, Class: Class });
            }
        });
    }
}

type Converted<T> = {
    [K in keyof T]?: any;
};

export interface TestConversionOptions<T> {
    getClass: () => { new(...args: any[]): T };
    conversions: { input: T, output: Converted<T> }[];
    valid?: T[];
    invalid?: T[];
}

export function testConversion<T>(options: TestConversionOptions<T>) {
    const { getClass, conversions, valid, invalid } = options;

    it('should convert property using validator', () => {
        // tslint:disable-next-line: no-inferred-empty-object-type
        const Class = getClass();
        const validator = new Validator({ convert: true });

        conversions.forEach(({ input, output }) => {
            const result = validator.validateAsClass(input, Class);
            expect(result.error).toBeFalsy();
            expect(result.value).toEqual(output);
        });
    });

    if (valid && valid.length) {
        it('should not fail for candidates even when convert option is disabled in validator', () => {
            // tslint:disable-next-line: no-inferred-empty-object-type
            const Class = getClass();
            const validator = new Validator({ convert: false });

            valid.forEach((input) => {
                expect(input).toBeValid({ Class: Class, validator });
            });
        });
    }

    if (invalid && invalid.length) {
        it('should fail for candidates when convert option is disabled in validator', () => {
            // tslint:disable-next-line: no-inferred-empty-object-type
            const Class = getClass();
            const validator = new Validator({ convert: false });

            invalid.forEach((input) => {
                expect(input).not.toBeValid({ Class: Class, validator });
            });
        });
    }
}
