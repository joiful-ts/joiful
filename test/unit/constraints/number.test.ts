import '../metadataShim';
import { registerJoi } from '../../../src/core';
import * as Joi from '@hapi/joi';
import { testConstraintWithPojos } from '../testUtil';
import {
    Greater,
    Integer,
    Less,
    Max,
    Min,
    Multiple,
    NumberSchema,
    Negative,
    Positive,
    Precision,
} from '../../../src/constraints/number';
import { Strict } from '../../../src/constraints/any';
import { Validator } from '../../../src/Validator';

registerJoi(Joi);

describe('Number constraints', () => {
    describe('NumberSchema', () => {
        describe('when using fluent API', () => {
            class AgeVerificationForm {
                @NumberSchema((schema) => schema.integer().min(18).required())
                age?: number;
            }

            testConstraintWithPojos(
                () => AgeVerificationForm,
                [{ age: 18 }],
                [{}, { age: 17 }],
            );
        });

        describe('when not using fluent API', () => {
            class AgeVerificationForm {
                @NumberSchema()
                age?: number;
            }

            testConstraintWithPojos(
                () => AgeVerificationForm,
                [{ age: 18 }],
                [{ age: 'Ralph' as any }],
            );
        });
    });

    describe('Greater', () => {
        class AgeVerificationForm {
            @Greater(17)
            age?: number;
        }

        testConstraintWithPojos(
            () => AgeVerificationForm,
            [{ age: 18 }],
            [{ age: 17 }],
        );
    });

    describe('Integer', () => {
        class CatAdoptionForm {
            @Integer()
            catCount?: number;
        }

        testConstraintWithPojos(
            () => CatAdoptionForm,
            [{ catCount: 3 }, { catCount: 50 }],
            [{ catCount: 0.5 }],
        );
    });

    describe('Less', () => {
        class CatAdoptionForm {
            @Less(10)
            catCount?: number;
        }

        testConstraintWithPojos(
            () => CatAdoptionForm,
            [{ catCount: 1 }],
            [{ catCount: 10 }],
        );
    });

    describe('Max', () => {
        class CatAdoptionForm {
            @Max(9)
            catCount?: number;
        }

        testConstraintWithPojos(
            () => CatAdoptionForm,
            [{ catCount: 1 }],
            [{ catCount: 10 }],
        );
    });

    describe('Min', () => {
        class CatAdoptionForm {
            @Min(1)
            catCount?: number;
        }

        testConstraintWithPojos(
            () => CatAdoptionForm,
            [{ catCount: 1 }],
            [{ catCount: 0 }],
        );
    });

    describe('Multiple', () => {
        class GamingConsole {
            @Multiple(8)
            bits?: number;
        }

        testConstraintWithPojos(
            () => GamingConsole,
            [{ bits: 8 }, { bits: 16 }, { bits: 32 }, { bits: 64 }],
            [{ bits: 4 }, { bits: 10 }],
        );
    });

    describe('Negative', () => {
        class Adjustment {
            @Negative()
            amount?: number;
        }

        testConstraintWithPojos(
            () => Adjustment,
            [{ amount: -1 }, { amount: -1.1 }],
            [{ amount: 1 }, { amount: 0 }],
        );
    });

    describe('Positive', () => {
        class WorkplaceStatus {
            @Positive()
            daysSinceLastAccident?: number;
        }

        testConstraintWithPojos(
            () => WorkplaceStatus,
            [{ daysSinceLastAccident: 1 }],
            [{ daysSinceLastAccident: -1 }, { daysSinceLastAccident: 0 }],
        );
    });

    describe('Precision', () => {
        describe('with strict mode', () => {
            class Deposit {
                @Strict()
                @Precision(2)
                amount?: number;
            }

            testConstraintWithPojos(
                () => Deposit,
                [{ amount: 1.11 }, { amount: 1.1 }, { amount: 1 }],
                [{ amount: 1.123 }],
            );
        });

        describe('without strict mode', () => {
            it('should pass validation but round the value', () => {
                class Deposit {
                    @Precision(2)
                    amount?: number;
                }

                const deposit = new Deposit();
                deposit.amount = 1.009;

                const validator = new Validator();
                let result = validator.validate(deposit);

                expect(result.error).toBeNull();
                expect(result.value).not.toEqual(deposit);
                expect(result.value).toEqual({ amount: 1.01 });

                deposit.amount = 1.001;
                result = validator.validate(deposit);

                expect(result.value).toEqual({ amount: 1 });
            });
        });
    });
});
