import { testConstraintWithPojos } from '../testUtil';
import { Joiful } from '../../../src/joiful';

describe('func', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    testConstraintWithPojos(
        () => {
            class Calculator {
                @jf.func()
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
        testConstraintWithPojos(
            () => {
                class Calculator {
                    @jf.func().arity(2)
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

        testConstraintWithPojos(
            () => {
                class Calculator {
                    @jf.func().minArity(1).maxArity(2)
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
