import { testConstraintWithPojos } from '../testUtil';
import { Joiful } from '../../../src/joiful';

describe('array', () => {
    let jf: Joiful;

    beforeEach(() => jf = new Joiful());

    describe('without an element type', () => {
        testConstraintWithPojos(
            () => {
                class Pizza {
                    @jf.array().required()
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
        testConstraintWithPojos(
            () => {
                class Actor {
                    @jf.string().required()
                    name!: string;
                }

                class Movie {
                    @jf.string().required()
                    name!: string;

                    @jf.array({ elementClass: Actor }).required()
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
            ],
        );
    });

    describe('items', () => {
        testConstraintWithPojos(
            () => {
                class MoviesQuiz {
                    @jf
                        .array()
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

        testConstraintWithPojos(
            () => {
                class MoviesQuiz {
                    @jf
                        .array()
                        .items(
                            jf.joi.string().empty('').required().min(6),
                            jf.joi.number().required(),
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
        testConstraintWithPojos(
            () => {
                class TodoList {
                    @jf.array().items((joi) => joi.string()).exactLength(2)
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
        testConstraintWithPojos(
            () => {
                class TodoList {
                    @jf.array().max(2)
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
        testConstraintWithPojos(
            () => {
                class TodoList {
                    @jf.array().min(1)
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

        testConstraintWithPojos(
            () => {
                class CsvRow {
                    @jf.array().ordered((joi) => [
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

        testConstraintWithPojos(
            () => {
                class CsvRow {
                    @jf.array().ordered(
                        jf.joi.string().required(),
                        jf.joi.string().required(),
                        jf.joi.number(),
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
            testConstraintWithPojos(
                () => {
                    class TodoList {
                        @jf.array().single()
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
            testConstraintWithPojos(
                () => {
                    class TodoList {
                        @jf.array().single(false)
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
                    @jf.array().sparse()
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

            testConstraintWithPojos(
                getTodoListClass,
                validTodoLists,
                [],
            );
        });

        describe('when disabled', () => {
            const invalidTodos: string[] = [];
            invalidTodos[0] = 'Write todo app';
            invalidTodos[99] = 'Feed the cats';

            testConstraintWithPojos(
                () => {
                    class TodoList {
                        @jf.array().sparse(false)
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
        testConstraintWithPojos(
            () => {
                class Primes {
                    @jf.array().unique()
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
