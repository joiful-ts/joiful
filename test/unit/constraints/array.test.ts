import { Items } from '../../../src/constraints/array';
import { Joi } from '../../../src/core';
import { testConstraintWithPojos } from '../testUtil';

describe('Array constraints', () => {
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
});
