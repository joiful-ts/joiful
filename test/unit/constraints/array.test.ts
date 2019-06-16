import "../metadataShim";
import {registerJoi, WORKING_SCHEMA_KEY} from "../../../src/core";
import * as Joi from 'joi';
import { Max, Length, ArraySchema, Min, Unique } from "../../../src/constraints/array";
import {Validator} from "../../../src/Validator";
import { testConstraint } from "../testUtil";


registerJoi(Joi);

describe('Array Test', () => {
    describe('Test Array methods ', () => {
        it('Should annotate class', () => {
            class MyClass {
                @ArraySchema()
                myProperty!: Array<number>
            }
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, MyClass.prototype);
            const expected = {
                myProperty: Joi.array()
            }
            expect(metadata).toEqual(expected)
        })
        it('Should allow correct max value for array', () => {
            class MyArrayClass {
                @Max(5)
                @ArraySchema()
                myArray!: Array<number>
            }
            let object = new MyArrayClass();
            object.myArray = [3,2,3,3];
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyArrayClass);
            expect(result.error).toBeNull();
        })
        it('Should allow correct max value for array - Negative Test', () => {
            class MyArrayClass {
                @Max(1)
                @ArraySchema()
                myArray!: Array<number>
            }
            let object = new MyArrayClass();
            object.myArray = [3,2,3,3];
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyArrayClass);
            expect(result.error).not.toBeNull();
        })
        it('Should allow the correct array length', () => {
            class MyArrayClass {
                @Length(4)
                @ArraySchema()
                myArray!: Array<number>
            }
            let object = new MyArrayClass();
            object.myArray = [3,2,3,3];
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyArrayClass);
            expect(result.error).toBeNull();
        })
        it('Should allow the correct array length - Negative Test', () => {
            class MyArrayClass {
                @Length(3)
                @ArraySchema()
                myArray!: Array<number>
            }
            let object = new MyArrayClass();
            object.myArray = [3,2,3,3];
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyArrayClass);
            expect(result.error).not.toBeNull();
        })
        it('Should allow the correct minimum value for Array', () => {
            class MyArrayClass {
                @Min(4)
                @ArraySchema()
                myArray!: Array<number>
            }
            let object = new MyArrayClass();
            object.myArray = [6,7,8,9];
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyArrayClass);
            expect(result.error).toBeNull();
        })
        it('Should allow the correct minimum value for Array - Negative Test', () => {
            class MyArrayClass {
                @Min(5)
                @ArraySchema()
                myArray!: Array<number>
            }
            let object = new MyArrayClass();
            object.myArray = [2,3,4];
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyArrayClass);
            expect(result.error).not.toBeNull();
        })
    })
    describe("Unique", function () {
        testConstraint<Array<number>>(() => {
                class MyClass {
                    @Unique()
                    myProperty : Array<number>;

                    constructor(myProperty: Array<number>) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [[3],[4,5],[6,7,8]],
            [[3,3,3],[3,3,3]]
        );
    });
})
