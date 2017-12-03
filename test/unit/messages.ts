import "./metadataShim";
import * as chai from "chai";
import {Validator} from "../../src/Validator";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";
import {StringConstraints} from "../../src/constraints/string";
import AssertStatic = Chai.AssertStatic;
const assert : AssertStatic = chai.assert;
import Length = StringConstraints.Length;
import {isValidationFail} from "../../src/ValidationResult";

registerJoi(Joi);

describe('Messages', function () {
    it('default message', function () {
        let validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty : string;
        }

        let instance = new ClassToValidate();
        instance.myProperty = "abc";

        let result = validator.validate(instance);
        assert.property(result, "error");
        assert.isNotNull(result.error, "Validation should fail");
        if (isValidationFail(result)) {
            assert.equal(result.error.details[0].message, `"myProperty" length must be 5 characters long`);
        }
    });

});