import { testConstraintWithPojos } from '../testUtil';
import { Joiful } from '../../../src/joiful';

describe('boolean', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    testConstraintWithPojos(
        () => {
            class MarketingOptIn {
                @jf.boolean()
                joinMailingList?: boolean;
            }
            return MarketingOptIn;
        },
        [{ joinMailingList: true }, { joinMailingList: false }],
        [{ joinMailingList: 'yep' as any }],
    );

    describe('truthy', () => {
        testConstraintWithPojos(
            () => {
                class MarketingOptIn {
                    @jf.boolean().truthy('yes').truthy('yeah', 'yeppers')
                    joinMailingList?: boolean;
                }
                return MarketingOptIn;
            },
            [
                { joinMailingList: true },
                { joinMailingList: false },
                { joinMailingList: 'yes' as any },
                { joinMailingList: 'yeah' as any },
                { joinMailingList: 'yeppers' as any },
            ],
            [{ joinMailingList: 'fo shizzle my nizzle' as any }],
        );
    });

    describe('falsy', () => {
        testConstraintWithPojos(
            () => {
                class MarketingOptIn {
                    @jf.boolean().falsy('no').falsy('nah', 'nope')
                    joinMailingList?: boolean;
                }
                return MarketingOptIn;
            },
            [
                { joinMailingList: true },
                { joinMailingList: false },
                { joinMailingList: 'no' as any },
                { joinMailingList: 'nah' as any },
                { joinMailingList: 'nope' as any },
            ],
            [{ joinMailingList: 'no way jose' as any }],
        );
    });

    describe('insensitive', () => {
        testConstraintWithPojos(
            () => {
                class MarketingOptIn {
                    @jf.boolean().truthy('y').falsy('n').insensitive()
                    joinMailingList?: boolean;
                }
                return MarketingOptIn;
            },
            [
                { joinMailingList: true },
                { joinMailingList: false },
                { joinMailingList: 'y' as any },
                { joinMailingList: 'Y' as any },
                { joinMailingList: 'n' as any },
                { joinMailingList: 'N' as any },
            ],
            [{ joinMailingList: 'no' as any }],
        );

        testConstraintWithPojos(
            () => {
                class MarketingOptIn {
                    @jf.boolean().truthy('y').falsy('n').insensitive(false)
                    joinMailingList?: boolean;
                }
                return MarketingOptIn;
            },
            [
                { joinMailingList: true },
                { joinMailingList: false },
                { joinMailingList: 'y' as any },
                { joinMailingList: 'n' as any },
            ],
            [
                { joinMailingList: 'Y' as any },
                { joinMailingList: 'N' as any },
            ],
        );
    });
});
