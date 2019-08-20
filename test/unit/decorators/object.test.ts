import { testConstraint } from '../testUtil';
import { Joiful } from '../../../src/joiful';

describe('object', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    describe('when not specifying object class and inferring class from property', () => {
        testConstraint(
            () => {
                class Address {
                    @jf.string()
                    line1?: string;

                    @jf.string()
                    line2?: string;

                    @jf.string().required()
                    city!: string;

                    @jf.string().required()
                    state!: string;

                    @jf.string().required()
                    country!: string;
                }

                class Contact {
                    @jf.string().required()
                    name!: string;

                    @jf.object().optional()
                    address?: Address;
                }

                return Contact;
            },
            [
                {
                    name: 'John Smith',
                    address: {
                        city: 'Melbourne',
                        state: 'Victoria',
                        country: 'Australia',
                    },
                },
                {
                    name: 'Jane Smith',
                },
            ],
            [
                {
                    name: 'Joe Shabadoo',
                    address: {
                    } as any,
                },
                {
                    name: 'Joe Shabadoo',
                    address: 1 as any,
                },
            ],
        );
    });

    describe('when specifying object class', () => {
        testConstraint(
            () => {
                class Address {
                    @jf.string()
                    line1?: string;

                    @jf.string()
                    line2?: string;

                    @jf.string().required()
                    city!: string;

                    @jf.string().required()
                    state!: string;

                    @jf.string().required()
                    country!: string;
                }

                class Contact {
                    @jf.string().required()
                    name!: string;

                    @jf.object({ objectClass: Address }).optional()
                    address?: Address;
                }

                return Contact;
            },
            [
                {
                    name: 'John Smith',
                    address: {
                        city: 'Melbourne',
                        state: 'Victoria',
                        country: 'Australia',
                    },
                },
                {
                    name: 'Jane Smith',
                },
            ],
            [
                {
                    name: 'Joe Shabadoo',
                    address: {
                    } as any,
                },
                {
                    name: 'Joe Shabadoo',
                    address: 1 as any,
                },
            ],
        );
    });

    describe('keys', () => {
        interface Address {
            line1?: string;
            line2?: string;
            city: string;
            state: string;
            country: string;
        }

        describe('when using callback', () => {
            testConstraint(
                () => {
                    class Contact {
                        @jf.string().required()
                        name!: string;

                        @jf
                            .object()
                            .keys((joi) => ({
                                city: joi.string().required(),
                                state: joi.string().required(),
                                country: joi.string().required(),
                            }))
                            .optional()
                        address?: Address;
                    }

                    return Contact;
                },
                [
                    {
                        name: 'John Smith',
                        address: {
                            city: 'Melbourne',
                            state: 'Victoria',
                            country: 'Australia',
                        },
                    },
                    {
                        name: 'Jane Smith',
                    },
                ],
                [
                    {
                        name: 'Joe Shabadoo',
                        address: {
                        } as any,
                    },
                    {
                        name: 'Joe Shabadoo',
                        address: 1 as any,
                    },
                ],
            );
        });

        describe('when not using callback', () => {
            testConstraint(
                () => {
                    class Contact {
                        @jf.string().required()
                        name!: string;

                        @jf
                            .object()
                            .keys({
                                city: jf.joi.string().required(),
                                state: jf.joi.string().required(),
                                country: jf.joi.string().required(),
                            })
                            .optional()
                        address?: Address;
                    }

                    return Contact;
                },
                [
                    {
                        name: 'John Smith',
                        address: {
                            city: 'Melbourne',
                            state: 'Victoria',
                            country: 'Australia',
                        },
                    },
                    {
                        name: 'Jane Smith',
                    },
                ],
                [
                    {
                        name: 'Joe Shabadoo',
                        address: {
                        } as any,
                    },
                    {
                        name: 'Joe Shabadoo',
                        address: 1 as any,
                    },
                ],
            );
        });
    });
});
