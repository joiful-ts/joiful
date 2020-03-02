import * as Joi from '@hapi/joi';
import * as jf from '../../src';
import {
    getJoiSchema,
    getJoiVersion,
    JOI_VERSION,
    checkJoiIsCompatible,
    IncompatibleJoiVersion,
    parseVersionString,
} from '../../src/core';
import { getJoifulDependencyVersion } from './testUtil';
import { stringify } from 'flatted';

describe('checkJoiIsCompatible', () => {
    it('should not error if version of joi passed in matches expected major version', () => {
        checkJoiIsCompatible(Joi);
    });

    it('should error if version of joi passed in is different to major version of joi used by joiful', () => {
        expect(() => checkJoiIsCompatible({ version: '-1.0.0' } as any as typeof Joi))
            .toThrowError(new IncompatibleJoiVersion({ major: '-1', minor: '0', patch: '0' }));
    });

    it('should not error if no joi instance is passed in', () => {
        checkJoiIsCompatible(undefined);
    });
});

describe('getJoiSchema', () => {
    it('should return the Joi schema to use for a decorated class', () => {
        class Cat {
            @jf.string()
            name!: string;
        }

        expect(getJoiSchema(Cat, jf.joi)).toEqual(jf.joi.object().keys({
            name: jf.joi.string(),
        }));
    });

    it('should return no schema when class is not decorated', () => {
        class Dog {
            name!: string;
        }

        expect(getJoiSchema(Dog, jf.joi)).toBeUndefined();
    });

    it('should support inheritance in classes', () => {
        class Animal {
            @jf.string()
            name!: string;
        }

        class Mammal extends Animal {
            @jf.number().min(2)
            nippleCount!: number;
        }

        class Cat extends Mammal {
            @jf.number().min(1).max(5)
            fluffinessIndex!: number;
        }

        const expectedSchema = jf.joi.object().keys({
            name: jf.joi.string(),
            nippleCount: jf.joi.number().min(2),
            fluffinessIndex: jf.joi.number().min(1).max(5),
        });

        expect(stringify(getJoiSchema(Cat, jf.joi))).toEqual(stringify(expectedSchema));
    });
});

describe('getJoiVersion', () => {
    const mockJoi = (version: string | undefined) => ({ version }) as any as typeof Joi;

    it('should return the version of joi', () => {
        expect(getJoiVersion(Joi)).not.toEqual({
            major: '?',
            minor: '?',
            patch: '?',
        });

        expect(getJoiVersion(mockJoi('1.2.3'))).toEqual({
            major: '1',
            minor: '2',
            patch: '3',
        });

        expect(getJoiVersion(mockJoi('1.2'))).toEqual({
            major: '1',
            minor: '2',
            patch: '',
        });
    });

    it('should not error if joi not defined', () => {
        expect(getJoiVersion(mockJoi(undefined))).toEqual({
            major: '?',
            minor: '?',
            patch: '?',
        });

        expect(getJoiVersion(undefined)).toEqual({
            major: '?',
            minor: '?',
            patch: '?',
        });
    });
});

describe('JOI_VERSION', () => {
    it('should match the version of joi referenced in Joifuls package dependencies', async () => {
        const expectedJoiVersion = await getJoifulDependencyVersion('@hapi/joi');
        expect(expectedJoiVersion.major).toBeTruthy();

        const actualJoiVersion = JOI_VERSION;
        expect(actualJoiVersion).toEqual(expectedJoiVersion);
    });
});

describe('parseVersionString', () => {
    it('should parse a version string and return it as object', () => {
        expect(parseVersionString('1.2.3')).toEqual({
            major: '1',
            minor: '2',
            patch: '3',
        });
    });

    it('should handle blank versions', () => {
        expect(parseVersionString('')).toEqual({
            major: '',
            minor: '',
            patch: '',
        });
    });
});
