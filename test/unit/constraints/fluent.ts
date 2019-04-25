import "../metadataShim";
import { registerJoi } from "../../../src/core";
import * as joi from "joi";
import { Joi } from "../../../src/constraints/fluent";
import { testConstraintWithPojos } from '../testUtil';

registerJoi(joi);

describe('Fluent API', () => {
    class SignUpForm {
        @Joi(joi => joi.string().email().required())
        emailAddress: string = '';

        @Joi(joi => joi.string().min(8).required())
        password: string = '';

        @Joi(joi => joi.string().required())
        firstName: string = '';

        @Joi(joi => joi.string().required())
        lastName: string = '';

        @Joi(joi => joi.number())
        age?: number;
    }

    testConstraintWithPojos(
        () => SignUpForm,
        [{
            emailAddress: 'valid@example.com',
            password: 'swordfish',
            firstName: 'Hugh',
            lastName: 'Hackman',
            age: 33
        }],
        [{
            emailAddress: 'invalid',
            password: '',
            firstName: 'Hugh',
            lastName: 'Hackman',
        }]
    );
});
