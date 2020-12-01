import { testConstraint } from '../testUtil';
import { boolean } from '../../../src';

describe('boolean', () => {
    testConstraint(
        () => {
            class MarketingOptIn {
                @boolean()
                joinMailingList?: boolean;
            }
            return MarketingOptIn;
        },
        [{ joinMailingList: true }, { joinMailingList: false }],
        [{ joinMailingList: 'yep' as any }],
    );

    describe('truthy', () => {
        testConstraint(
            () => {
                class MarketingOptIn {
                    @boolean().truthy('yes').truthy('yeah', 'yeppers')
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
        testConstraint(
            () => {
                class MarketingOptIn {
                    @boolean().falsy('no').falsy('nah', 'nope')
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
        testConstraint(
            () => {
                class MarketingOptIn {
                    @boolean().truthy('y').falsy('n').sensitive(false)
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

        testConstraint(
            () => {
                class MarketingOptIn {
                    @boolean().truthy('y').falsy('n').sensitive()
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
