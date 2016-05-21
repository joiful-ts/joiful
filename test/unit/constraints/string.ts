import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
var assert : AssertStatic = chai.assert;
import {SCHEMA_KEY} from "../../../src/core";
import {StringSchema} from "../../../src/constraints/string";
import * as Joi from "joi";
import {ConstraintDefinitionError} from "../../../src/core";
import {Length} from "../../../src/constraints/string";
import {Validator} from "../../../src/Validator";
import {Alphanum} from "../../../src/constraints/string";
import {Min} from "../../../src/constraints/string";
import {isValid} from "../testUtil";
import {isInvalid} from "../testUtil";
import {registerJoi} from "../../../src/core";
import {testConstraint} from "../testUtil";
import {CreditCard} from "../../../src/constraints/string";

registerJoi(Joi);

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
    testConstraint<string>(() => {
            class MyClass {
                @Alphanum()
                myProperty:string;

                constructor(myProperty:string) {
                    this.myProperty = myProperty;
                }
            }
            return MyClass;
        },
        ["abcdEFG12390"],
        ["!@#$"]
    );
});

describe("CreditCard", function () {
    testConstraint<string>(() => {
            class MyClass {
                @CreditCard()
                myProperty : string;

                constructor(myProperty:string) {
                    this.myProperty = myProperty;
                }
            }
            return MyClass;
        },
        ["4444333322221111"],
        ["abcd", "1234", "4444-3333-2222-1111"]
    );
});

describe("Min", function () {
    testConstraint<string>(() => {
            class MyClass {
                @Min(5)
                myProperty : string;

                constructor(myProperty : string) {
                    this.myProperty = myProperty;
                }
            }
            return MyClass;
        },
        ["abcdEFG12390"],
        ["!@#$"]
    );
});