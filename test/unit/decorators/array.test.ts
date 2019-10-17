import { testConstraint } from '../testUtil';
import { array, joi, string } from '../../../src';

describe('array', () => {
    describe('without an element type', () => {
        testConstraint(
            () => {
                class Pizza {
                    @array().required()
                    toppings!: string[];
                }
                return Pizza;
            },
            [
                { toppings: ['pepperoni', 'cheese'] },
                { toppings: [1, 3] },
                { toppings: [1, 'cheese'] },
                { toppings: [] },
            ],
            [
                {
                    toppings: 'cheese',
                },
                {
                    toppings: 1 as any,
                },
            ],
        );
    });

    describe('with an element type', () => {
        testConstraint(
            () => {
                class Actor {
                    @string().required()
                    name!: string;
                }

                class Movie {
                    @string().required()
                    name!: string;

                    @array({ elementClass: Actor }).required()
                    actors!: Actor[];
                }

                return Movie;
            },
            [
                {
                    name: 'The Faketrix',
                    actors: [
                        { name: 'Laurence Fishberg' },
                        { name: 'Keanu Wick' },
                        { name: 'Carrie-Anne More' },
                    ],
                },
            ],
            [
                {
                    name: 'The Faketrix',
                    actors: [
                        { name: 'Laurence Fishberg' },
                        {},
                        { name: 'Carrie-Anne More' },
                    ],
                },
                {
                    name: 'The Faketrix',
                    actors: [1, 2, 3],
                },
                {
                    name: 'The Faketrix',
                    actors: [
                        'Laurence Fishberg',
                        'Keanu Wick',
                        'Carrie-Anne More',
                    ],
                },
            ],
        );
    });

    describe('items', () => {
        testConstraint(
            () => {
                class MoviesQuiz {
                    @array()
                        .items(
                            (joi) => [
                                joi.string().empty('').required().min(6),
                                joi.number().required(),
                            ],
                        )
                    favouriteMovies!: (string | number)[];
                }

                return MoviesQuiz;
            },
            [{ favouriteMovies: ['Citizen Kane', 'Casablanca', 'The Matrix Reloaded: Revenge of the Smiths', 7] }],
            [{ favouriteMovies: [''] }, { favouriteMovies: [false as any] }],
        );

        testConstraint(
            () => {
                class MoviesQuiz {
                    @array()
                        .items(
                            joi.string().empty('').required().min(6),
                            joi.number().required(),
                        )
                    favouriteMovies!: (string | number)[];
                }

                return MoviesQuiz;
            },
            [{ favouriteMovies: ['Citizen Kane', 'Casablanca', 'The Matrix Reloaded: Revenge of the Smiths', 7] }],
            [{ favouriteMovies: [''] }, { favouriteMovies: [false as any] }],
        );
    });

    describe('exactLength', () => {
        testConstraint(
            () => {
                class TodoList {
                    @array().items((joi) => joi.string()).exactLength(2)
                    todos?: string[];
                }
                return TodoList;
            },
            [
                { todos: ['Write todo app', 'Feed the cats'] },
            ],
            [
                { todos: [] },
                { todos: ['Write todo app'] },
                { todos: ['Write todo app', 'Feed the cats', 'Do the things'] },
            ],
        );
    });

    describe('max', () => {
        testConstraint(
            () => {
                class TodoList {
                    @array().max(2)
                    todos?: string[];
                }
                return TodoList;
            },
            [
                { todos: [] },
                { todos: ['Write todo app'] },
                { todos: ['Write todo app', 'Feed the cats'] },
            ],
            [
                { todos: ['Write todo app', 'Feed the cats', 'Do the things'] },
            ],
        );
    });

    describe('min', () => {
        testConstraint(
            () => {
                class TodoList {
                    @array().min(1)
                    todos?: string[];
                }
                return TodoList;
            },
            [
                { todos: ['Write todo app'] },
                { todos: ['Write todo app', 'Feed the cats'] },
            ],
            [
                { todos: [] },
            ],
        );
    });

    describe('ordered', () => {
        type CsvRowValues = [string, string, number];

        testConstraint(
            () => {
                class CsvRow {
                    @array().ordered((joi) => [
                        joi.string().required(),
                        joi.string().required(),
                        joi.number(),
                    ])
                    values!: CsvRowValues;
                }

                return CsvRow;
            },
            [
                { values: ['John', 'Doh', 36] },
                { values: ['Jane', 'Doh'] },
            ],
            [
                { values: [] },
                { values: ['Joey Joey Joe'] },
                { values: ['Joey Joey Joe'] },
                { values: [1, 2, 3] as any },
            ],
        );

        testConstraint(
            () => {
                class CsvRow {
                    @array().ordered(
                        joi.string().required(),
                        joi.string().required(),
                        joi.number(),
                    )
                    values!: CsvRowValues;
                }

                return CsvRow;
            },
            [
                { values: ['John', 'Doh', 36] },
                { values: ['Jane', 'Doh'] },
            ],
            [
                { values: [] },
                { values: ['Joey Joey Joe'] },
                { values: ['Joey Joey Joe'] },
                { values: [1, 2, 3] as any },
            ],
        );
    });

    describe('single', () => {
        describe('when enabled', () => {
            testConstraint(
                () => {
                    class TodoList {
                        @array().single()
                        todos?: string[] | string;
                    }
                    return TodoList;
                },
                [
                    { todos: ['Write todo app'] },
                    { todos: ['Write todo app', 'Feed the cats'] },
                    { todos: 'Pass a single todo' },
                ],
                [],
            );
        });

        describe('when disabled', () => {
            testConstraint(
                () => {
                    class TodoList {
                        @array().single(false)
                        todos?: string[] | string;
                    }
                    return TodoList;
                },
                [
                    { todos: ['Write todo app'] },
                    { todos: ['Write todo app', 'Feed the cats'] },
                ],
                [
                    { todos: 'Pass a single todo' },
                ],
            );
        });
    });

    describe('sparse', () => {
        describe('when enabled', () => {
            const getTodoListClass = () => {
                class TodoList {
                    @array().sparse()
                    todos!: string[];
                }
                return TodoList;
            };

            const validTodoLists: InstanceType<ReturnType<typeof getTodoListClass>>[] = [
                { todos: [] },
                { todos: [] },
            ];

            validTodoLists[0].todos = ['Write todo app', 'Feed the cats'];
            validTodoLists[1].todos[0] = 'Write todo app';
            validTodoLists[1].todos[99] = 'Feed the cats';

            testConstraint(
                getTodoListClass,
                validTodoLists,
                [],
            );
        });

        describe('when disabled', () => {
            const invalidTodos: string[] = [];
            invalidTodos[0] = 'Write todo app';
            invalidTodos[99] = 'Feed the cats';

            testConstraint(
                () => {
                    class TodoList {
                        @array().sparse(false)
                        todos!: string[];
                    }
                    return TodoList;
                },
                [{ todos: ['Write todo app', 'Feed the cats'] }],
                [{ todos: invalidTodos }],
            );
        });
    });

    describe('unique', () => {
        testConstraint(
            () => {
                class Primes {
                    @array().unique()
                    values!: number[];
                }
                return Primes;
            },
            [
                { values: [] },
                { values: [2] },
                { values: [2, 3, 5, 7, 11] },
            ],
            [
                { values: [2, 2, 3] },
            ],
        );
    });
});
