import * as chai from "chai";
var assert : AssertStatic = chai.assert;
import {SCHEMA_KEY} from "../../../src/core";
import {StringSchema} from "../../../src/constraints/StringSchema";
import AssertStatic = Chai.AssertStatic;
import * as Joi from "joi";
import {ConstraintDefinitionError} from "../../../src/core";

describe("StringSchema", function () {
    class MyClass {
        @StringSchema()
        myProperty : string;

        @StringSchema()
        myOtherProperty : String;
    }

    it("should annotate the class property", function() {
        var metadata = Reflect.getMetadata(SCHEMA_KEY, MyClass.prototype, "myProperty");
        assert.deepEqual(metadata, Joi.string());
    });

    it("should error when applied to a non-string property", function() {
        assert.throws(function () {
            class MyBadClass {
                @StringSchema()
                myBadProperty : number;
            }
        }, ConstraintDefinitionError);
    });
});