import { testConstraint } from '../testUtil';
import { date } from '../../../src';
import { Validator } from '../../../src/validation';

describe('date', () => {
    testConstraint(
        () => {
            class Age {
                @date()
                dateOfBirth?: Date;
            }
            return Age;
        },
        [
            {},
            { dateOfBirth: new Date(2000, 0, 1) },
        ],
        [
            { dateOfBirth: 'not a date' as any },
        ],
    );

    describe('iso', () => {
        testConstraint(
            () => {
                class Age {
                    @date().iso()
                    dateOfBirth?: Date;
                }
                return Age;
            },
            [
                { dateOfBirth: '2017-02-20' as any },
                { dateOfBirth: '2017-02-20T22:55:12Z' as any },
                { dateOfBirth: '2017-02-20T22:55:12' as any },
                { dateOfBirth: '2017-02-20T22:55' as any },
                { dateOfBirth: '2017-02-20T22:55:12+1100' as any },
                { dateOfBirth: '2017-02-20T22:55:12+11:00' as any },
            ],
            [
                { dateOfBirth: '20-02-2017' as any },
                { dateOfBirth: '20/02/2017' as any },
                { dateOfBirth: '2017/02/20' as any },
                { dateOfBirth: '2017-02-20T22' as any },
                { dateOfBirth: '2017-02-20T22:55:' as any },
            ],
        );
    });

    describe('max', () => {
        const now = Date.now();

        testConstraint(
            () => {
                class Age {
                    @date().max(now)
                    dateOfBirth?: Date;
                }
                return Age;
            },
            [
                {},
                { dateOfBirth: now as any },
                { dateOfBirth: now - 1 as any },
            ],
            [
                { dateOfBirth: now + 1 as any },
            ],
        );
    });

    describe('min', () => {
        const earliestDateOfBirth = (new Date(1900, 0, 1)).getTime();

        testConstraint(
            () => {
                class Age {
                    @date().min(earliestDateOfBirth)
                    dateOfBirth?: Date;
                }
                return Age;
            },
            [
                {},
                { dateOfBirth: earliestDateOfBirth as any },
                { dateOfBirth: earliestDateOfBirth + 1 as any },
            ],
            [
                { dateOfBirth: earliestDateOfBirth - 1 as any },
            ],
        );
    });

    describe('timestamp', () => {
        describe('using javascript time (the default)', () => {
            it('should coerce a numeric date to a JS Date', () => {
                class AgeVerification {
                    @date().timestamp('javascript')
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
                    @date().timestamp('unix')
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
