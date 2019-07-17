import './metadataShim';
import { Validator } from '../../src/Validator';
import { Validate } from '../../src/Validate';
import { MultipleValidationError } from '../../src/MultipleValidationError';
import { registerJoi } from '../../src/core';
import * as Joi from '@hapi/joi';
import { Length } from '../../src/constraints/string';

registerJoi(Joi);

describe('Validate', () => {
    it('decorates a target method', () => {
        const validator = new Validator();

        class ClassToValidate {
            @Length(5)
            myProperty!: string;
        }

        class OuterClass {
            @Validate(validator)
            run(arg: ClassToValidate, basicArg: number) {
                expect(arg).not.toBeNull();
                expect(basicArg).not.toBeNull();
            }
        }

        const instance = new ClassToValidate();
        instance.myProperty = 'abc';

        const outer = new OuterClass();
        expect(() => {
            outer.run(instance, 5);
            fail();
        }).toThrow(MultipleValidationError);

        instance.myProperty = 'abcde';
        outer.run(instance, 5);
    });
});
