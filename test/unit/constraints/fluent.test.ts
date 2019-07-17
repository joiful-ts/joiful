import '../metadataShim';
import { registerJoi } from '../../../src/core';
import * as joi from '@hapi/joi';
import { JoiSchema } from '../../../src/constraints/fluent';
import { testConstraintWithPojos } from '../testUtil';

registerJoi(joi);

describe('Fluent API', () => {
  class SignUpForm {
    @JoiSchema((joi) => joi.string().email().required())
    emailAddress: string = '';

    @JoiSchema((joi) => joi.string().min(8).required())
    password: string = '';

    @JoiSchema((joi) => joi.string().required())
    firstName: string = '';

    @JoiSchema((joi) => joi.string().required())
    lastName: string = '';

    @JoiSchema((joi) => joi.number())
    age?: number;
  }

  testConstraintWithPojos(
    () => SignUpForm,
    [{
      emailAddress: 'valid@example.com',
      password: 'swordfish',
      firstName: 'Hugh',
      lastName: 'Hackman',
      age: 33,
    }],
    [{
      emailAddress: 'invalid',
      password: '',
      firstName: 'Hugh',
      lastName: 'Hackman',
    }],
  );
});
