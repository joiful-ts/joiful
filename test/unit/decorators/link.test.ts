import { testConstraint } from '../testUtil';
//import { array, string, link } from '../../../src';
import * as jf from '../../../src';

describe('link', () => {
    it('uninitialized link will throw', () => {
        expect(() => {
            class Node {
                @jf.link()
                child?: Node;
            }
            return Node;
        }).toThrow(new Error('Invalid reference key: '));
    });

    describe('link named schema (explicit)', () => {
        testConstraint(
            () => {
                class Foo {
                    @jf.number().integer()
                    a?: number;

                    @jf.link('a')
                    b?: number;
                }
                return Foo;
            },
            [{ a: 1, b: 1 }],
            [{ a: 1, b: 3.14 }],
        );
    });
});
