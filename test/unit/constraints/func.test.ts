import '../metadataShim';
import { registerJoi } from '../../../src/core';
import * as Joi from 'joi';
import { testConstraintWithPojos } from '../testUtil';
import {
    Arity,
    FuncSchema,
    MinArity,
    MaxArity,
} from '../../../src/constraints/func';
import { Required } from '../../../src/constraints/any';

registerJoi(Joi);

describe('Function constraints', () => {
    describe('FuncSchema', () => {
        describe('when using fluent API', () => {
            class Calculator {
                @FuncSchema((schema) => schema.required())
                pi?: () => number;
            }

            testConstraintWithPojos(
                () => Calculator,
                [{ pi: () => Math.PI }],
                [{}, { pi: Math.PI as any }],
            );
        });

        describe('when not using fluent API', () => {
            class Calculator {
                @Required()
                @FuncSchema()
                pi?: () => number;
            }

            testConstraintWithPojos(
                () => Calculator,
                [{ pi: () => Math.PI }],
                [{}, { pi: Math.PI as any }],
            );
        });
    });

    describe('Arity', () => {
        class Calculator {
            @Arity(2)
            @FuncSchema()
            add?: (v1: number, v2: number) => number;
        }

        testConstraintWithPojos(
            () => Calculator,
            [{ add: (v1: number, v2: number) => v1 + v2 }],
            [
                { add: (v1: number) => v1 },
                { add: ((v1: number, v2: number, v3: number) => v1 + v2 + v3) as any },
            ],
        );
    });

    describe('MinArity and MaxArity', () => {
        type AddFunction = (v1: number, v2: number) => number;
        type CurriableAddFunction = (v1: number) => (v2: number) => number;

        class Calculator {
            @MinArity(1)
            @MaxArity(2)
            @FuncSchema()
            add?: AddFunction | CurriableAddFunction;
        }

        testConstraintWithPojos(
            () => Calculator,
            [
                { add: (v1: number) => (v2: number) => v1 + v2 },
                { add: (v1: number, v2: number) => v1 + v2 },
            ],
            [
                { add: () => 0 },
                { add: ((v1: number, v2: number, v3: number) => v1 + v2 + v3) as any },
            ],
        );
    });
});
