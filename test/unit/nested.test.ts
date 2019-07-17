import './metadataShim';
import { Validator } from '../../src/Validator';
import { registerJoi, ValidationSchemaNotFound } from '../../src/core';
import * as Joi from '@hapi/joi';
import { Length } from '../../src/constraints/string';
import { Nested, NestedArray, NestedPropertyTypeUnknown } from '../../src/Nested';
import { Required } from '../../src/constraints/any';

registerJoi(Joi);

describe('Nested', () => {
    it('Errors when a nested property has a type of class (function) but is not decorated with Nested()', () => {
        expect(() => {
            class NestedClassToValidate {
                @Length(3)
                @Required()
                public myProperty!: string;
            }

            class ClassToValidate {
                @Required()
                public nestedProperty!: NestedClassToValidate;
            }

            return ClassToValidate;
        }).toThrow(new ValidationSchemaNotFound('nestedProperty'));
    });

    it('Can annotate a nested property', () => {
        let validator = new Validator();

        class NestedClassToValidate {
            @Length(3)
            @Required()
            public myProperty!: string;
        }

        class ClassToValidate {
            @Required()
            @Nested()
            public nestedProperty!: NestedClassToValidate;
        }

        let instance = new ClassToValidate();
        instance.nestedProperty = {
            myProperty: 'abc',
        };

        let result = validator.validate(instance);
        expect(result.error).toBeNull();
    });

    it('Errors when a nested property does not have a type of class (function)', () => {
        expect(() => {
            class ClassToValidate {
                @Required()
                @Nested()
                public nestedProperty!: { myProperty: string };
            }
            return ClassToValidate;
        }).toThrow(new NestedPropertyTypeUnknown('nestedProperty'));
    });

    it('Can annotate a nested property by manually passing a class', () => {
        let validator = new Validator();

        class NestedClassToValidate {
            @Length(3)
            @Required()
            public myProperty!: string;
        }

        class ClassToValidate {
            @Required()
            @Nested(NestedClassToValidate)
            public nestedProperty!: { myProperty: string };
        }

        let instance = new ClassToValidate();
        instance.nestedProperty = {
            myProperty: 'abc',
        };

        let result = validator.validate(instance);
        expect(result.error).toBeNull();
    });

    it('Can annotate a nested array', () => {
        let validator = new Validator();

        class NestedClassToValidate {
            @Length(3)
            @Required()
            public myProperty!: string;
        }

        class ClassToValidate {
            @Required()
            @NestedArray(NestedClassToValidate)
            public nestedProperty!: { myProperty: string }[];
        }

        let instance = new ClassToValidate();
        instance.nestedProperty = [{
            myProperty: 'abc',
        }];
        let result = validator.validate(instance);
        expect(result.error).toBeNull();

        instance.nestedProperty = [];
        result = validator.validate(instance);
        expect(result.error).toBeNull();

        instance.nestedProperty = [
            <any>{
                random: 'value',
            },
        ];
        result = validator.validate(instance);
        expect(result.error).not.toBeNull();
    });
});
