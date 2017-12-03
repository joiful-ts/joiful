import "../metadataShim";
import * as chai from "chai";
import {ConstraintDefinitionError, registerJoi, WORKING_SCHEMA_KEY} from "../../../src/core";
import * as Joi from "joi";
import {testConstraint} from "../testUtil";
import {DateConstraints} from "../../../src/constraints/date";
import AssertStatic = Chai.AssertStatic;
import DateSchema = DateConstraints.DateSchema;
import Iso = DateConstraints.Iso;
const assert : AssertStatic = chai.assert;

registerJoi(Joi);

describe("Date constraints", function () {
    describe("DateSchema", function () {
        class MyClass {
            @DateSchema()
            myProperty : Date;

            @DateSchema()
            myOtherProperty : string;
        }

        it("should annotate the class property", function () {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, MyClass.prototype);
            const expected = {
                myProperty: Joi.date(),
                myOtherProperty: Joi.date(),
            };
            assert.deepEqual(metadata, expected);
        });

        it("should error when applied to a non-date property", function () {
            assert.throws(function () {
                class MyBadClass {
                    @DateSchema()
                    myBadProperty : number;
                }
            }, ConstraintDefinitionError);
        });
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
