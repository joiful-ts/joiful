import * as chai from "chai";
var assert : AssertStatic = chai.assert;
import {SCHEMA_KEY} from "../../../src/core";
import {StringSchema} from "../../../src/constraints/string/StringSchema";
import AssertStatic = Chai.AssertStatic;
import * as Joi from "joi";
import {ConstraintDefinitionError} from "../../../src/core";
import {Length} from "../../../src/constraints/common/Length";
import {Validator} from "../../../src/Validator";

describe("StringSchema", function () {
    class MyClass {
        @StringSchema()
        myProperty : string;

        @StringSchema()
        myOtherProperty : String;
    }

    it("should annotate the class property", function () {
        var metadata = Reflect.getMetadata(SCHEMA_KEY, MyClass.prototype);
        var expected = {
            myProperty: Joi.string(),
            myOtherProperty: Joi.string()
        };
        assert.deepEqual(metadata, expected);
    });

    it("should error when applied to a non-string property", function () {
        assert.throws(function () {
            class MyBadClass {
                @StringSchema()
                myBadProperty : number;
            }
        }, ConstraintDefinitionError);
    });
});

describe("Length", function () {
    it("should annotate the class property", function () {
        class MyClass {
            @Length(5)
            @StringSchema()
            myProperty : string;
        }

        var metadata = Reflect.getMetadata(SCHEMA_KEY, MyClass.prototype);
        var expected : any = {
            myProperty: Joi.string().length(5)
        };
        assert.equal(JSON.stringify(metadata), JSON.stringify(expected));
    });

    it("should validate successful candidates", function () {
        class MyClass {
            @Length(5)
            @StringSchema()
            myProperty : string;
        }

        var object = new MyClass();
        object.myProperty = "abcde";
        var validator = new Validator();
        var result = validator.validate(object);
        console.log(result);
        assert.property(result, "error");
        assert.isNull(result.error);
    });

    it("should validate failing candidates", function () {
        class MyClass {
            @Length(5)
            @StringSchema()
            myProperty : string;
        }

        var object = new MyClass();
        object.myProperty = "abc";
        var validator = new Validator();
        var result = validator.validate(object);
        console.log(result);
        assert.property(result, "error");
        assert.isNotNull(result.error);
    });

    it("should validate successful candidate created from object literal", function () {
        class MyClass {
            @Length(5)
            @StringSchema()
            myProperty : string;
        }

        var object = {
            myProperty: "abcde"
        };
        var validator = new Validator();
        var result = validator.validateAsClass(object, MyClass);
        console.log(result);
        assert.property(result, "error");
        assert.isNull(result.error);
    });

    it("should validate failing candidate created from object literal", function () {
        class MyClass {
            @Length(5)
            @StringSchema()
            myProperty : string;
        }

        var object = {
            myProperty: "abc"
        };
        var validator = new Validator();
        var result = validator.validateAsClass(object, MyClass);
        console.log(result);
        assert.property(result, "error");
        assert.isNotNull(result.error);
    });
});