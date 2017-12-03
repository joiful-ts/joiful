import "./metadataShim";
import * as chai from "chai";
import {Validator} from "../../src/Validator";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";
import {StringConstraints} from "../../src/constraints/string";
import {Nested, NestedArray} from "../../src/Nested";
import {AnyConstraints} from "../../src/constraints/any";
import AssertStatic = Chai.AssertStatic;
const assert : AssertStatic = chai.assert;
const Length = StringConstraints.Length;
const Required = AnyConstraints.Required;

registerJoi(Joi);

describe('Nested', function () {
    it('Errors when a nested property has a type of class (function) but is not decorated with Nested()', function () {

        try {
            class NestedClassToValidate {
                @Length(3)
                @Required()
                public myProperty : string;
            }

            class ClassToValidate {
                @Required()
                public nestedProperty : NestedClassToValidate;
            }
            assert.fail();
        } catch (err) {
            assert.equal(err && err.message, `No validation schema exists, nor could it be inferred from the design:type metadata, for property "nestedProperty". Please decorate the property with a type schema.`);
        }
    });

    it('Can annotate a nested property', function () {
        let validator = new Validator();

        class NestedClassToValidate {
            @Length(3)
            @Required()
            public myProperty : string;
        }

        class ClassToValidate {
            @Required()
            @Nested()
            public nestedProperty : NestedClassToValidate;
        }

        let instance = new ClassToValidate();
        instance.nestedProperty = {
            myProperty: "abc"
        };

        let result = validator.validate(instance);
        assert.isNull(result.error, "Validation should pass");
    });

    it('Errors when a nested property does not have a type of class (function)', function () {
        try {
            class ClassToValidate {
                @Required()
                @Nested()
                public nestedProperty : { myProperty : string };
            }
            assert.fail();
        } catch (err) {
            assert.equal(err && err.message, `Class "Object" doesn't have a schema. You may need to manually specify the base type schema, set the property type to a class, or use "Any()".`);
        }
    });

    it('Can annotate a nested property by manually passing a class', function () {
        let validator = new Validator();

        class NestedClassToValidate {
            @Length(3)
            @Required()
            public myProperty : string;
        }

        class ClassToValidate {
            @Required()
            @Nested(NestedClassToValidate)
            public nestedProperty : { myProperty : string };
        }

        let instance = new ClassToValidate();
        instance.nestedProperty = {
            myProperty: "abc"
        };

        let result = validator.validate(instance);
        assert.isNull(result.error, "Validation should pass");
    });

    it('Can annotate a nested array', function () {
        let validator = new Validator();

        class NestedClassToValidate {
            @Length(3)
            @Required()
            public myProperty : string;
        }

        class ClassToValidate {
            @Required()
            @NestedArray(NestedClassToValidate)
            public nestedProperty : { myProperty : string }[];
        }

        let instance = new ClassToValidate();
        instance.nestedProperty = [{
            myProperty: "abc"
        }];
        let result = validator.validate(instance);
        assert.isNull(result.error, "Validation should pass");

        instance.nestedProperty = [];
        result = validator.validate(instance);
        assert.isNull(result.error, "Validation should pass");

        instance.nestedProperty = [
            <any> {
                random: 'value'
            }
        ];
        result = validator.validate(instance);
        assert.isNotNull(result.error, "Validation should fail");
    });
});