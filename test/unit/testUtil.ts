import { Validator } from '../../src/validation';
import { ValidationOptions } from 'joi';

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
