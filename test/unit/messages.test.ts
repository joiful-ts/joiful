import "./metadataShim";
import {Validator} from "../../src/Validator";
import {registerJoi} from "../../src/core";
import * as Joi from "joi";
import {Length} from "../../src/constraints/string";
import {isValidationFail} from "../../src/ValidationResult";

registerJoi(Joi);

describe('Messages', function () {
    it('default message', function () {
        let validator = new Validator();

        class ClassToValidate {
            @Length(5)
            public myProperty! : string;
        }

        let instance = new ClassToValidate();
        instance.myProperty = "abc";

        let result = validator.validate(instance);
        expect(result).toHaveProperty('error');
        expect(result.error).not.toBeNull();
        expect(result.error!.details[0].message).toEqual(`"myProperty" length must be 5 characters long`);
    });
});
