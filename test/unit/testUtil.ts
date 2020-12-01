import * as Joi from '@hapi/joi';
import { rootPath } from 'get-root-path';
import * as path from 'path';
import * as fs from 'fs';
import { Validator } from '../../src/validation';
import { AnyClass, getJoiSchema, getJoi, parseVersionString } from '../../src/core';

export function notNil<T>(value: T): Exclude<T, null | undefined> {
    if (value === null || value === undefined) {
        throw new Error('Unexpected nil value');
    }
    return value as Exclude<T, null | undefined>;
}

export function testConstraint<T>(
    classFactory: () => { new(...args: any[]): T },
    valid: T[],
    invalid?: T[],
    validationOptions?: Joi.ValidationOptions,
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

export function assertClassSchemaEquals(
    options: { Class: AnyClass, expectedSchemaMap: Joi.SchemaMap, joi?: typeof Joi },
) {
    const joi = getJoi(options);
    const schema = getJoiSchema(options.Class, joi);
    const expectedSchema = joi.object().keys(options.expectedSchemaMap);
    expect(Object.keys(schema!)).toEqual(Object.keys(expectedSchema));
}

interface PackageDependencies {
    [name: string]: string;
}

interface PackageJson {
    peerDependencies?: PackageDependencies;
    dependencies?: PackageDependencies;
    devDependencies?: PackageDependencies;
}

export async function getJoifulDependencyVersion(dependencyName: string) {
    const joifulPackageFileName = path.join(rootPath, 'package.json');
    const joifulPackageJson: PackageJson = await new Promise(
        (resolve, reject) => fs.readFile(
            joifulPackageFileName, 'utf-8', (err, content) => err ? reject(err) : resolve(JSON.parse(content)),
        ),
    );
    const allDependencies: PackageDependencies = {
        ...joifulPackageJson.peerDependencies,
        ...joifulPackageJson.dependencies,
        ...joifulPackageJson.devDependencies,
    };
    return parseVersionString(allDependencies[dependencyName]);
}
