import "./testUtil";
import {Min} from "../../src/constraints/number";
import {Validator} from "../../src/Validator";
import {getMergedWorkingSchemas, getWorkingSchema} from "../../src/core";

describe(`Inheritance`, function () {
    const validator = new Validator({
        abortEarly: false,
        presence: 'required'
    });

    it(`Working schemas in inheritence chains are correctly merged`, function () {
        class ParentClass {
            @Min(10)
            foo! : number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar! : number;
        }

        const parentSchemaUnmerged = getWorkingSchema(ParentClass.prototype);
        expect(parentSchemaUnmerged.foo).toBeDefined();
        expect(parentSchemaUnmerged.bar).toBeUndefined();

        const parentSchema = getMergedWorkingSchemas(ParentClass.prototype);
        expect(parentSchema.foo).toBeDefined();
        expect(parentSchema.bar).toBeUndefined();

        const childSchema = getMergedWorkingSchemas(ChildClass.prototype);
        expect(childSchema.foo).toBeDefined()
        expect(childSchema.bar).toBeDefined()
    });

    it(`Inheriting classes apply both the parent's validations, and the child's validations`, function () {
        class ParentClass {
            @Min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar!: number;
        }

        const instance = new ChildClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(2);
    });

    it(`Child validations do not apply when validating the parent class`, function () {
        class ParentClass {
            @Min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar!: number;
        }

        const instance = new ParentClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(1);
    });

    it(`Child validations can override the parent's validations`, function () {
        class ParentClass {
            @Min(10)
            foo! : number;
        }
        class ChildClass extends ParentClass {
            @Min(0)
            foo! : number;
        }

        const instance = new ChildClass();
        instance.foo = 1;
        expect(instance).toBeValid({ validator });
    });

    it(`Grandchild classes apply validations from parent and grandparent classes`, function () {
        class ParentClass {
            @Min(10)
            foo! : number;
        }
        class ChildClass extends ParentClass {
            @Min(10)
            bar! : number;
        }
        class GrandchildClass extends ChildClass {
            @Min(10)
            baz! : number;
        }

        const instance = new GrandchildClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(3);
    });

    it(`Grandchild classes without any validations apply validations from the grandparent class`, function () {
        class ParentClass {
            @Min(10)
            foo! : number;
        }
        class ChildClass extends ParentClass {
            bar! : number;
        }
        class GrandchildClass extends ChildClass {
            baz! : number;
        }

        const instance = new GrandchildClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(1);
    });
});
