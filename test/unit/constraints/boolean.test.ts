import '../metadataShim';
import { registerJoi, WORKING_SCHEMA_KEY } from '../../../src/core';
import * as Joi from '@hapi/joi';
import { testConstraint, testConstraintWithPojos } from '../testUtil';
import { BooleanSchema, Truthy, Falsy, Insensitive } from '../../../src/constraints/boolean';

registerJoi(Joi);

describe('Boolean constraints', () => {
    describe('BooleanSchema', () => {
        class MyClass {
            @BooleanSchema()
            myProperty!: boolean;
        }

        it('should annotate the class property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, MyClass.prototype);
            const expected = {
                myProperty: Joi.boolean(),
            };
            expect(metadata).toEqual(expected);
        });

        /**
         * TODO: test compilation failures
         */
        xit('should error when applied to a non-boolean property', () => {
            // expect(() => {
            //     class MyBadClass {
            //         @BooleanSchema()
            //         myBadProperty! : number;

            //         @BooleanSchema()
            //         myOtherBadProperty! : string;
            //     }
            //     return MyBadClass;
            // }).toThrow(ConstraintDefinitionError);
        });

        describe('when using fluent API', () => {
            class AcceptTermsAndConditionsForm {
                @BooleanSchema((schema) => schema.required())
                accept?: boolean;
            }

            testConstraintWithPojos(
                () => AcceptTermsAndConditionsForm,
                [
                    { accept: true },
                    { accept: false },
                ],
                [{}],
            );
        });
    });

    describe('Truthy', () => {
        testConstraint<any>(
            () => {
                class MyClass {
                    @Truthy(1, 5)
                    myProperty: boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [1, 5],
            [0, 2, '1', 'y', 'Y'],
        );
        testConstraint<any>(
            () => {
                class MyClass {
                    @Truthy('1', 'y')
                    myProperty: boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['1', 'y', 'Y'],
            [0, 1, 2, 5, '0', 'yes'],
        );
    });

    describe('Falsy', () => {
        testConstraint<any>(
            () => {
                class MyClass {
                    @Falsy(0, 5)
                    myProperty: boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [0, 5],
            ['0', 1, 'n', 'N'],
        );
        testConstraint<any>(
            () => {
                class MyClass {
                    @Falsy('0', 'n')
                    myProperty: boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['0', 'n', 'N'],
            [0, 1, 2, 5, 'yes', 'no'],
        );
    });

    describe('Insensitive', () => {
        testConstraint<any>(
            () => {
                class MyClass {
                    @Insensitive(false)
                    @Falsy('n')
                    @Truthy('y')
                    myProperty: boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['y', 'n'],
            ['Y', 'N'],
        );
    });
});
