import { testConstraintWithPojos } from '../testUtil';
import { Joiful } from '../../../src/joiful';
import { getJoiSchema } from '../../../src/core';

describe('lazy', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    testConstraintWithPojos(
        () => {
            class TreeNode {
                @jf.string()
                title!: string;

                @jf.lazy(({ joi }) => joi.array().items(getJoiSchema(TreeNode))).optional()
                children?: TreeNode[];
            }
            return TreeNode;
        },
        [
            {
                title: 'a',
                children: [
                    {
                        title: 'a-1',
                    },
                    {
                        title: 'a-2',
                    },
                ],
            },
            {
                title: 'b',
                children: [
                    {
                        title: 'b-1',
                        children: [
                            {
                                title: 'b-1-1',
                            },
                            {
                                title: 'b-1-2',
                            },
                        ],
                    },
                    {
                        title: 'b-2',
                    },
                ],
            },
            {
                title: 'c',
                children: [],
            },
            {
                title: 'd',
            },
        ],
        [
            {
                title: 'a',
                children: [
                    1 as any,
                    2 as any,
                ],
            },
            {
                title: 'b',
                children: 1 as any,
            },
        ],
    );
});
