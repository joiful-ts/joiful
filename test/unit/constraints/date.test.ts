import "../metadataShim";
import {ConstraintDefinitionError, registerJoi, WORKING_SCHEMA_KEY} from "../../../src/core";
import * as Joi from "joi";
import { testConstraint, testConstraintWithPojos } from '../testUtil';
import {DateSchema, Iso} from "../../../src/constraints/date";

registerJoi(Joi);

describe("Date constraints", function () {
    describe("DateSchema", function () {
        class MyClass {
            @DateSchema()
            myProperty! : Date;

            @DateSchema()
            myOtherProperty! : string;
        }

        it("should annotate the class property", function () {
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
        xit("should error when applied to a non-date property", function () {
            // expect(function () {
            //     class MyBadClass {
            //         @DateSchema()
            //         myBadProperty! : number;
            //     }
            // }).toThrow(ConstraintDefinitionError);
        });

        describe('when using fluent API', () => {
            class AgeVerificationForm {
                @DateSchema(schema => schema.required().min(new Date(1900, 0, 1)))
                dateOfBirth?: Date;
            }

            testConstraintWithPojos(
                () => AgeVerificationForm,
                [{ dateOfBirth: new Date(1990, 0, 30) }],
                [
                    {},
                    { dateOfBirth: new Date(1899, 11, 30) }
                ]
            );
        })
    });

    describe("Iso", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Iso()
                    myProperty : Date;

                    constructor(myProperty: Date) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["2017-02-20", "2017-02-20T22:55:12Z", "2017-02-20T22:55:12", "2017-02-20T22:55", "2017-02-20T22:55:12+1100", "2017-02-20T22:55:12+11:00"],
            ["20-02-2017", "20/02/2017", "2017/02/20", "2017-02-20T22", "2017-02-20T22:55:"]
        );
    });
});
