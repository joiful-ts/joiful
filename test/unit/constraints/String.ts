import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
var assert : AssertStatic = chai.assert;
import {SCHEMA_KEY} from "../../../src/core";
import {StringSchema} from "../../../src/constraints/string/StringSchema";
import * as Joi from "joi";
import {ConstraintDefinitionError} from "../../../src/core";
import {Length} from "../../../src/constraints/string/Length";
import {Validator} from "../../../src/Validator";
import {Alphanum} from "../../../src/constraints/string/Alphanum";
import {Min} from "../../../src/constraints/string/Min";
import {isValid} from "../testUtil";
import {isInvalid} from "../testUtil";

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

describe("Length, and core functionality", function () {
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
        isValid(validator, object);
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
        isInvalid(validator, object);
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
        //console.log(result);
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
        //console.log(result);
        assert.property(result, "error");
        assert.isNotNull(result.error);
    });

    it("should create Joi type schema derived from property type, if no type schema specified", function () {
        class MyClass {
            @Length(5)
            myProperty : string;
        }

        let object = new MyClass();
        object.myProperty = "abcde";
        const validator = new Validator();
        isValid(validator, object);
    });
});

describe("Alphanum", function () {
    class MyClass {
        @Alphanum()
        myProperty : string;

        constructor(myProperty : string) {
            this.myProperty = myProperty;
        }
    }
    const validator = new Validator();

    it("should validate successful candidates", function () {
        isValid(validator,
            new MyClass("abcdEFG12390")
        );
    });

    it("should validate failing candidates", function () {
        isInvalid(validator,
            new MyClass("!@#$")
        );
    });
});

describe("Min", function () {
    class MyClass {
        @Min(5)
        myProperty : string;

        constructor(myProperty : string) {
            this.myProperty = myProperty;
        }
    }
    const validator = new Validator();

    it("should validate successful candidates", function () {
        isValid(validator,
            new MyClass("abcdEFG12390")
        );
    });

    it("should validate failing candidates", function () {
        isInvalid(validator,
            new MyClass("!@#$")
        );
    });
});