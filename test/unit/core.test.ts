import * as jf from '../../src';
import { getJoiSchema } from '../../src/core';

describe('getJoiSchema', () => {
    it('should return the Joi schema to use for a decorated class', () => {
        class Cat {
            @jf.string()
            name!: string;
        }

        expect(getJoiSchema(Cat, jf.joi)).toEqual(jf.joi.object().keys({
            name: jf.joi.string(),
        }));

        class Dog {
            name!: string;
        }

        expect(getJoiSchema(Dog, jf.joi)).toEqual(jf.joi.object().keys({}));
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

        expect(JSON.stringify(getJoiSchema(Cat, jf.joi))).toEqual(JSON.stringify(expectedSchema));
    });
});
