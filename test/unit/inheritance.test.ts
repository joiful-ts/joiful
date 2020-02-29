import './testUtil';
import { Joiful } from '../../src/joiful';
import { Validator } from '../../src/validation';
import { getMergedWorkingSchemas, getWorkingSchema } from '../../src/core';
import { notNil } from './testUtil';

let jf: Joiful;

beforeEach(() => {
    jf = new Joiful();
});

describe('Inheritance', () => {
    const validator = new Validator({
        abortEarly: false,
        presence: 'required',
    });

    it('Working schemas in inheritance chains are correctly merged', () => {
        class ParentClass {
            @jf.number().min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            @jf.number().min(10)
            bar!: number;
        }

        const parentSchemaUnmerged = notNil(getWorkingSchema(ParentClass.prototype));
        expect(parentSchemaUnmerged.foo).toBeDefined();
        expect(parentSchemaUnmerged.bar).toBeUndefined();

        const parentSchema = notNil(getMergedWorkingSchemas(ParentClass.prototype));
        expect(parentSchema.foo).toBeDefined();
        expect(parentSchema.bar).toBeUndefined();

        const childSchema = notNil(getMergedWorkingSchemas(ChildClass.prototype));
        expect(childSchema.foo).toBeDefined();
        expect(childSchema.bar).toBeDefined();
    });

    it("Inheriting classes apply both the parent's validations, and the child's validations", () => {
        class ParentClass {
            @jf.number().min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            @jf.number().min(10)
            bar!: number;
        }

        const instance = new ChildClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(2);
    });

    it('Child validations do not apply when validating the parent class', () => {
        class ParentClass {
            @jf.number().min(10)
            foo!: number;
        }

        class ChildClass extends ParentClass {
            @jf.number().min(10)
            bar!: number;
        }

        const instance = new ParentClass();
        const result = validator.validate(instance);
        expect(ChildClass).toBeTruthy();
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(1);
    });

    it("Child validations can override the parent's validations", () => {
        class ParentClass {
            @jf.number().min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            @jf.number().min(0)
            foo!: number;
        }

        const instance = new ChildClass();
        instance.foo = 1;
        expect(instance).toBeValid({ validator });
    });

    it('Grandchild classes apply validations from parent and grandparent classes', () => {
        class ParentClass {
            @jf.number().min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            @jf.number().min(10)
            bar!: number;
        }
        class GrandchildClass extends ChildClass {
            @jf.number().min(10)
            baz!: number;
        }

        const instance = new GrandchildClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(3);
    });

    it('Grandchild classes without any validations apply validations from the grandparent class', () => {
        class ParentClass {
            @jf.number().min(10)
            foo!: number;
        }
        class ChildClass extends ParentClass {
            bar!: number;
        }
        class GrandchildClass extends ChildClass {
            baz!: number;
        }

        const instance = new GrandchildClass();
        const result = validator.validate(instance);
        expect(result.error).toBeTruthy();
        expect(result.error!.details).toHaveLength(1);
    });
});
