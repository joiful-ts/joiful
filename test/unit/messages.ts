import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
const assert : AssertStatic = chai.assert;
import {Validator} from "../../src/Validator";
import {Length} from "../../src/constraints/string";
import {isValid} from "./testUtil";
import {isInvalid} from "./testUtil";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";

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
        assert.equal(result.error.details[0].message, `"myProperty" length must be 5 characters long`);
    });

});