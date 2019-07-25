import {
    ArraySchema,
    Items,
    Length,
    Max,
    Min,
    Ordered,
    Unique,
    Single,
    Sparse,
} from '../../../src/constraints/array';
import {
    Joi,
    WORKING_SCHEMA_KEY,
} from '../../../src/core';
import { testConstraintWithPojos } from '../testUtil';

describe('Array constraints', () => {

    describe('ArraySchema', () => {
        it('should annotate class', () => {
            class Movie {
                @ArraySchema()
                actors!: Array<string>;
            }
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, Movie.prototype);
            const expected = {
                actors: Joi.array(),
            };
            expect(metadata).toEqual(expected);
        });

        describe('when using fluent API', () => {
            it('should annotate class', () => {
                class Movie {
                    @ArraySchema((schema) => schema.required())
                    actors!: Array<string>;
                }
                const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, Movie.prototype);
                const expected = {
                    actors: Joi.array().required(),
                };
                expect(metadata).toEqual(expected);
            });
        });
    });

    describe('Items', () => {
        describe('when using fluent API', () => {
            const getClass = () => {
                class MoviesQuiz {
                    @Items((joi) => joi.string().empty('').required().min(6))
                    favouriteMovies!: string[];
                }

                return MoviesQuiz;
            };

            testConstraintWithPojos(
                getClass,
                [{ favouriteMovies: ['Citizen Kane', 'Casablanca', 'The Matrix Reloaded: Revenge of the Smiths'] }],
                [{ favouriteMovies: [''] }, { favouriteMovies: true }],
            );
        });

        describe('when using fluent API returning array of types', () => {
            const getClass = () => {
                class MoviesQuiz {
                    @Items((joi) => [joi.string().empty('').required().min(6), joi.number().required()])
                    favouriteMovies!: (string | number)[];
                }

                return MoviesQuiz;
            };

            testConstraintWithPojos(
                getClass,
                [{ favouriteMovies: ['Citizen Kane', 'Casablanca', 'The Matrix Reloaded: Revenge of the Smiths', 7] }],
                [{ favouriteMovies: [''] }, { favouriteMovies: [false as any] }],
            );
        });

        describe('when not using fluent API', () => {
            const getClass = () => {
                class MoviesQuiz {
                    @Items(Joi.string().empty('').required().min(6), Joi.number())
                    favouriteMovies!: (string | number)[];
                }

                return MoviesQuiz;
            };

            testConstraintWithPojos(
                getClass,
                [{ favouriteMovies: ['Citizen Kane', 'Casablanca', 'The Matrix Reloaded: Revenge of the Smiths', 7] }],
                [{ favouriteMovies: [''] }, { favouriteMovies: ['Big'] }, { favouriteMovies: false as any }],
            );
        });
    });

    describe('Length', () => {
        class TodoList {
            @Length(2)
            @ArraySchema()
            todos?: string[];
        }

        testConstraintWithPojos(
            () => TodoList,
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

    describe('Max', () => {
        class TodoList {
            @Max(2)
            @ArraySchema()
            todos?: string[];
        }

        testConstraintWithPojos(
            () => TodoList,
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

    describe('Min', () => {
        class TodoList {
            @Min(1)
            @ArraySchema()
            todos?: string[];
        }

        testConstraintWithPojos(
            () => TodoList,
            [
                { todos: ['Write todo app'] },
                { todos: ['Write todo app', 'Feed the cats'] },
            ],
            [
                { todos: [] },
            ],
        );
    });

    describe('Ordered', () => {
        type CsvRowValues = [string, string, number];

        describe('when using fluent API', () => {
            const getClass = () => {
                class CsvRow {
                    @Ordered((joi) => [
                        joi.string().required(),
                        joi.string().required(),
                        joi.number(),
                    ])
                    values!: CsvRowValues;
                }

                return CsvRow;
            };

            testConstraintWithPojos(
                getClass,
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

        describe('when not using fluent API', () => {
            const getClass = () => {
                class CsvRow {
                    @Ordered(
                        Joi.string().required(),
                        Joi.string().required(),
                        Joi.number(),
                    )
                    values!: CsvRowValues;
                }

                return CsvRow;
            };

            testConstraintWithPojos(
                getClass,
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
    });

    describe('Single', () => {
        describe('when enabled', () => {

            class TodoList {
                @Single()
                @ArraySchema()
                todos?: string[] | string;
            }

            testConstraintWithPojos(
                () => TodoList,
                [
                    { todos: ['Write todo app'] },
                    { todos: ['Write todo app', 'Feed the cats'] },
                    { todos: 'Pass a single todo' },
                ],
                [],
            );
        });

        describe('when disabled', () => {

            class TodoList {
                @Single(false)
                @ArraySchema()
                todos?: string[] | string;
            }

            testConstraintWithPojos(
                () => TodoList,
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

    describe('Sparse', () => {
        describe('when enabled', () => {

            class TodoList {
                @Sparse()
                @ArraySchema()
                todos!: string[];
            }

            const validTodoLists: TodoList[] = [
                { todos: [] },
                { todos: [] },
            ];

            validTodoLists[0].todos = ['Write todo app', 'Feed the cats'];
            validTodoLists[1].todos[0] = 'Write todo app';
            validTodoLists[1].todos[99] = 'Feed the cats';

            testConstraintWithPojos(
                () => TodoList,
                validTodoLists,
                [],
            );
        });

        describe('when disabled', () => {

            class TodoList {
                @Sparse(false)
                @ArraySchema()
                todos!: string[];
            }

            const invalidTodos: string[] = [];
            invalidTodos[0] = 'Write todo app';
            invalidTodos[99] = 'Feed the cats';

            testConstraintWithPojos(
                () => TodoList,
                [{ todos: ['Write todo app', 'Feed the cats'] }],
                [{ todos: invalidTodos }],
            );
        });
    });

    describe('Unique', () => {
        class Primes {
            @Unique()
            values!: number[];
        }

        testConstraintWithPojos(
            () => Primes,
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
