import {isValid} from "./testUtil";
import {Validator} from "../../src/Validator";
import {NumberConstraints} from "../../src/constraints/number";
import NumberSchema = NumberConstraints.NumberSchema;
import Min = NumberConstraints.Min;
import { assert } from "chai";
import {ConstraintDefinitionError, Joi} from "../../src/core";
import {AnyConstraints} from "../../src/constraints/any";
import Optional = AnyConstraints.Optional;
import {ObjectConstraints} from "../../src/constraints/object";
import Keys = ObjectConstraints.Keys;
import ObjectSchema = ObjectConstraints.ObjectSchema;

describe(`Gotchas`, function () {
    describe(`object types`, function () {
        it(`an inline or anonymous interface must be explicitly annotated with ObjectSchema()`, function () {
            try {
                class ClassToValidate {
                    @Keys({
                        nestedProperty: Joi.number()
                    })
                    public myProperty : {
                        nestedProperty : number;
                    };
                }
                assert.fail();
            } catch (err) {
                if (!(err instanceof ConstraintDefinitionError)) {
                    throw err;
                }
                assert.equal(err.message, "No validation schema exists, nor could it be inferred from the design:type metadata, for property \"myProperty\". Please decorate the property with a type schema.");
            }

            const validator = new Validator();
            class ClassToValidate2 {
                @Keys({
                    nestedProperty: Joi.number()
                })
                @ObjectSchema()
                public myProperty : {
                    nestedProperty : number;
                };
            }

            const instance = new ClassToValidate2();
            instance.myProperty = {
                nestedProperty: 123
            };
            isValid(validator, instance);
        });
    });

    describe(`union types`, function () {
        it('an optional property will pass', function () {
            const validator = new Validator();
            class ClassToValidate {
                @Min(10)
                @Optional()
                @NumberSchema()
                public myProperty? : number;
            }

            const instance = new ClassToValidate();
            isValid(validator, instance);
        });

        it('a union with undefined, but without an explicit schema annotation, will fail', function () {
            try {
                class ClassToValidate {
                    @Min(10)
                    @Optional()
                    public myProperty : number | undefined;
                }
                assert.fail();
            } catch (err) {
                assert.instanceOf(err, ConstraintDefinitionError);
                assert.equal(err.message, `No validation schema exists, nor could it be inferred from the design:type metadata, for property "myProperty". Please decorate the property with a type schema.`);
            }
        });

        it('a union with undefined and an explicit schema annotation will pass', function () {
            const validator = new Validator();
            class ClassToValidate {
                @Min(10)
                @Optional()
                @NumberSchema()
                public myProperty : number | undefined;
            }

            const instance = new ClassToValidate();
            isValid(validator, instance);
        });

        it('nullable number property without explicit schema annotation will fail', function () {
            try {
                class ClassToValidate {
                    @Min(10)
                    public myProperty : number | null;
                }
                assert.fail();
            } catch (err) {
                assert.instanceOf(err, ConstraintDefinitionError);
                assert.equal(err.message, `No validation schema exists, nor could it be inferred from the design:type metadata, for property "myProperty". Please decorate the property with a type schema.`);
            }
        });

        it('nullable number property with explicit schema annotation will pass', function () {
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