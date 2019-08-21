import { testConstraint } from '../testUtil';
import { func } from '../../../src';

describe('func', () => {
    testConstraint(
        () => {
            class Calculator {
                @func()
                pi!: () => number;
            }
            return Calculator;
        },
        [
            { pi: () => Math.PI },
            { pi: () => { } },
            { pi: (...args: any[]) => args },
            {},
        ],
        [
            { pi: Math.PI as any },
        ],
    );

    describe('arity', () => {
        testConstraint(
            () => {
                class Calculator {
                    @func().arity(2)
                    add?: (v1: number, v2: number) => number;
                }
                return Calculator;
            },
            [{ add: (v1: number, v2: number) => v1 + v2 }],
            [
                { add: (v1: number) => v1 },
                { add: ((v1: number, v2: number, v3: number) => v1 + v2 + v3) as any },
            ],
        );
    });

    describe('minArity and maxArity', () => {
        type AddFunction = (v1: number, v2: number) => number;
        type CurriableAddFunction = (v1: number) => (v2: number) => number;

        testConstraint(
            () => {
                class Calculator {
                    @func().minArity(1).maxArity(2)
                    add?: AddFunction | CurriableAddFunction;
                }
                return Calculator;
            },
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
