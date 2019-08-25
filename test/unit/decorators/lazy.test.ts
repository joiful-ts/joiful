import { testConstraint } from '../testUtil';
import { lazy, string } from '../../../src';
import { getJoiSchema } from '../../../src/core';

describe('lazy', () => {
    testConstraint(
        () => {
            class TreeNode {
                @string()
                title!: string;

                @lazy(({ joi }) => joi.array().items(getJoiSchema(TreeNode, joi))).optional()
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
