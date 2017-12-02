import {isValid} from "./testUtil";
import {Validator} from "../../src/Validator";
import {NumberConstraints} from "../../src/constraints/number";
import NumberSchema = NumberConstraints.NumberSchema;
import Min = NumberConstraints.Min;
import { assert } from "chai";
import {ConstraintDefinitionError} from "../../src/core";
import {AnyConstraints} from "../../src/constraints/any";
import Optional = AnyConstraints.Optional;

describe(`Gotchas`, function () {
    describe(`union types`, function () {
        it('a union with undefined will fail', function () {
            try {
                class ClassToValidate {
                    @Optional()
                    @NumberSchema()
                    public myProperty : number | undefined;
                }
                assert.fail();
            } catch (err) {
                assert.instanceOf(err, ConstraintDefinitionError);
                assert.equal(err.message, "Constrained property \"myProperty\" has an unsupported type. Wanted \"Number\", found \"Object\"");
            }
        });

        it('an optional property will work', function () {
            const validator = new Validator();
            class ClassToValidate {
                @Optional()
                @NumberSchema()
                public myProperty? : number;
            }

            const instance = new ClassToValidate();
            isValid(validator, instance);
        });

        it('nullable number/string property with explicit schema annotation', function () {
            const validator = new Validator();

            class ClassToValidate {
                @Min(10)
                @NumberSchema()
                public myProperty : number | null;
            }

            const instance = new ClassToValidate();
            instance.myProperty = 20;

            isValid(validator, instance);
        });
    });
});