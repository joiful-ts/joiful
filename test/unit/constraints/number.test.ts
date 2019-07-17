import '../metadataShim';
import { registerJoi } from '../../../src/core';
import * as Joi from '@hapi/joi';
import { testConstraintWithPojos } from '../testUtil';
import { NumberSchema } from '../../../src/constraints/number';

registerJoi(Joi);

describe('Number constraints', () => {
    describe('NumberSchema', () => {
        describe('when using fluent API', () => {
            class AgeVerificationForm {
                @NumberSchema((schema) => schema.positive().min(18).required())
                age?: number;
            }

            testConstraintWithPojos(
                () => AgeVerificationForm,
                [{ age: 18 }],
                [
                    {},
                    { age: 17 },
                ],
            );
        });
    });
});
