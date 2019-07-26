import '../metadataShim';
import { registerJoi, WORKING_SCHEMA_KEY } from '../../../src/core';
import * as Joi from 'joi';
import { testConstraint, testConstraintWithPojos } from '../testUtil';
import { Validator } from '../../../src/Validator';
import {
    DateSchema,
    Iso,
    Max,
    Min,
    Timestamp,
} from '../../../src/constraints/date';

registerJoi(Joi);

describe('Date constraints', () => {
    describe('DateSchema', () => {
        class MyClass {
            @DateSchema()
            myProperty!: Date;

            @DateSchema()
            myOtherProperty!: string;
        }

        it('should annotate the class property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, MyClass.prototype);
            const expected = {
                myProperty: Joi.date(),
                myOtherProperty: Joi.date(),
            };
            expect(metadata).toEqual(expected);
        });

        /**
         * TODO: test compilation failures
         */
        xit('should error when applied to a non-date property', () => {
            // expect(() => {
            //     class MyBadClass {
            //         @DateSchema()
            //         myBadProperty! : number;
            //     }
            //     return MyBadClass;
            // }).toThrow(ConstraintDefinitionError);
        });

        describe('when using fluent API', () => {
            class AgeVerificationForm {
                @DateSchema((schema) => schema.required().min(new Date(1900, 0, 1)))
                dateOfBirth?: Date;
            }

            testConstraintWithPojos(
                () => AgeVerificationForm,
                [{ dateOfBirth: new Date(1990, 0, 30) }],
                [
                    {},
                    { dateOfBirth: new Date(1899, 11, 30) },
                ],
            );
        });
    });

    describe('Iso', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Iso()
                    myProperty: Date;

                    constructor(myProperty: Date) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [
                '2017-02-20',
                '2017-02-20T22:55:12Z',
                '2017-02-20T22:55:12',
                '2017-02-20T22:55',
                '2017-02-20T22:55:12+1100',
                '2017-02-20T22:55:12+11:00',
            ],
            [
                '20-02-2017',
                '20/02/2017',
                '2017/02/20',
                '2017-02-20T22',
                '2017-02-20T22:55:',
            ],
        );
    });

    describe('Max', () => {
        const now = Date.now();

        class AgeVerification {
            @Max(now)
            dateOfBirth?: Date;
        }

        testConstraintWithPojos(
            () => AgeVerification,
            [
                { dateOfBirth: new Date(now) },
                { dateOfBirth: new Date(now - 1) },
            ],
            [
                { dateOfBirth: new Date(now + 1) },
            ],
        );
    });

    describe('Min', () => {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
        const MAX_AGE_IN_YEARS = 130;
        const MIN_DATE_OF_BIRTH_IN_MS = Date.now() - (MS_IN_YEAR * MAX_AGE_IN_YEARS);

        class AgeVerification {
            @Min(MIN_DATE_OF_BIRTH_IN_MS)
            dateOfBirth?: Date;
        }

        testConstraintWithPojos(
            () => AgeVerification,
            [
                { dateOfBirth: new Date(MIN_DATE_OF_BIRTH_IN_MS) },
                { dateOfBirth: new Date(MIN_DATE_OF_BIRTH_IN_MS + 1) },
                { dateOfBirth: new Date() },
            ],
            [
                { dateOfBirth: new Date(MIN_DATE_OF_BIRTH_IN_MS - 1) },
            ],
        );
    });

    describe('Timestamp', () => {
        describe('using javascript time (the default)', () => {
            it('should coerce a numeric date to a JS Date', () => {
                class AgeVerification {
                    @Timestamp('javascript')
                    dateOfBirth?: Date;
                }

                const SECONDS_IN_DAY = 60 * 60 * 24;
                const MILLISECONDS_IN_DAY = SECONDS_IN_DAY * 1000;

                const ageVerification = { dateOfBirth: MILLISECONDS_IN_DAY };
                const validator = new Validator();
                const result = validator.validateAsClass(ageVerification, AgeVerification);
                expect(result.value.dateOfBirth).toBeInstanceOf(Date);
                expect(result.value.dateOfBirth).toEqual(new Date(Date.UTC(1970, 0, 2)));
            });
        });

        describe('using javascript time (the default)', () => {
            it('should coerce a (numeric) unix timestamp to a JS Date', () => {
                class AgeVerification {
                    @Timestamp('unix')
                    dateOfBirth?: Date;
                }

                const SECONDS_IN_DAY = 60 * 60 * 24;
                const ageVerification = { dateOfBirth: SECONDS_IN_DAY };
                const validator = new Validator();
                const result = validator.validateAsClass(ageVerification, AgeVerification);
                expect(result.value.dateOfBirth).toBeInstanceOf(Date);
                expect(result.value.dateOfBirth).toEqual(new Date(Date.UTC(1970, 0, 2)));
            });
        });
    });
});
