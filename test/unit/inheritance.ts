import {Min} from "../../src/constraints/number";
import {isInvalid, isValid} from "./testUtil";
import {Validator} from "../../src/Validator";
import {assert} from "chai";
import {getMergedWorkingSchemas, getWorkingSchema} from "../../src/core";

describe(`Inheritance`, function () {
    const validator = new Validator({
        abortEarly: false,
        presence: 'required'
    });

    it(`Working schemas in inheritence chains are correctly merged`, function () {
        class ParentClass {
            @Min(10)
            foo : number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar : number;
        }

        const parentSchemaUnmerged = getWorkingSchema(ParentClass.prototype);
        assert.isDefined(parentSchemaUnmerged.foo);
        assert.isUndefined(parentSchemaUnmerged.bar, `The child class's property "bar" should not be part of the parent class's unmerged schema`);

        const parentSchema = getMergedWorkingSchemas(ParentClass.prototype);
        assert.isDefined(parentSchema.foo);
        assert.isUndefined(parentSchema.bar, `The child class's property "bar" should not be part of the parent class's merged schema`);

        const childSchema = getMergedWorkingSchemas(ChildClass.prototype);
        assert.isDefined(childSchema.foo);
        assert.isDefined(childSchema.bar);
    });

    it(`Inheriting classes apply both the parent's validations, and the child's validations`, function () {
        class ParentClass {
            @Min(10)
            foo : number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar : number;
        }

        const instance = new ChildClass();
        const result = isInvalid(validator, instance);
        assert.lengthOf(result.error.details, 2);
    });

    it(`Child validations do not apply when validating the parent class`, function () {
        class ParentClass {
            @Min(10)
            foo : number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar : number;
        }

        const instance = new ParentClass();
        const result = isInvalid(validator, instance);
        assert.lengthOf(result.error.details, 1);
    });

    it(`Child validations can override the parent's validations`, function () {
        class ParentClass {
            @Min(10)
            foo : number;
        }
        class ChildClass extends ParentClass {
            @Min(0)
            foo : number;
        }

        const instance = new ChildClass();
        instance.foo = 1;
        isValid(validator, instance);
    });

    it(`Grandchild classes apply validations from parent and grandparent classes`, function () {
        class ParentClass {
            @Min(10)
            foo : number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar : number;
        }
        class GrandchildClass extends ChildClass {
            @Min(10)
            baz : number;
        }

        const instance = new GrandchildClass();
        const result = isInvalid(validator, instance);
        assert.lengthOf(result.error.details, 3);
    });

    it(`Grandchild classes without any validations apply validations from the grandparent class`, function () {
        class ParentClass {
            @Min(10)
            foo : number;
        }
        class ChildClass extends ParentClass {
            bar : number;
        }
        class GrandchildClass extends ChildClass {
            baz : number;
        }

        const instance = new GrandchildClass();
        const result = isInvalid(validator, instance);
        assert.lengthOf(result.error.details, 1);
    });
});
