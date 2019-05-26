import '../metadataShim';
import { registerJoi, WORKING_SCHEMA_KEY } from '../../../src/core';
import * as Joi from 'joi';
import { testConstraint } from '../testUtil';
import { DateSchema, Iso } from '../../../src/constraints/date';

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
});
