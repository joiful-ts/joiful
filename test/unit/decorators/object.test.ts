import { testConstraint } from '../testUtil';
import { joi, object, string } from '../../../src';

describe('object', () => {
    describe('when not specifying object class and inferring class from property', () => {
        testConstraint(
            () => {
                class Address {
                    @string()
                    line1?: string;

                    @string()
                    line2?: string;

                    @string().required()
                    city!: string;

                    @string().required()
                    state!: string;

                    @string().required()
                    country!: string;
                }

                class Contact {
                    @string().required()
                    name!: string;

                    @object().optional()
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
                    @string()
                    line1?: string;

                    @string()
                    line2?: string;

                    @string().required()
                    city!: string;

                    @string().required()
                    state!: string;

                    @string().required()
                    country!: string;
                }

                class Contact {
                    @string().required()
                    name!: string;

                    @object({ objectClass: Address }).optional()
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
                        @string().required()
                        name!: string;

                        @object()
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
                        @string().required()
                        name!: string;

                        @object()
                            .keys({
                                city: joi.string().required(),
                                state: joi.string().required(),
                                country: joi.string().required(),
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
