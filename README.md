<br />

<p align="center">
    <img width="500" src="https://raw.githubusercontent.com/joiful-ts/joiful/master/img/logo-icon-with-text-800x245.png">
    <h3 align="center" style="margin-top: 0px; padding-top: 0">TypeScript Declarative Validation for Joi</h3>
</p>

<br />

[![npm version](https://badge.fury.io/js/joiful.svg)](https://badge.fury.io/js/joiful)
[![GitHub Actions Build Status](https://github.com/joiful-ts/joiful/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/joiful-ts/joiful/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/joiful-ts/joiful/branch/master/graph/badge.svg)](https://codecov.io/gh/joiful-ts/joiful)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=joiful-ts/joiful)](https://dependabot.com)

## Why Joiful?

This lib allows you to apply Joi validation constraints on class properties, by using decorators.

This means you can combine your type schema and your validation schema in one go!

Calling `Validator.validateAsClass()` allows you to validate any object as if it were an instance of a given class.

## Installation

`npm add joiful reflect-metadata`

Or

`yarn add joiful reflect-metadata`.

You must enable experimental decorators and metadata in your TypeScript configuration.

`tsconfig.json`

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

## Basic Usage

Ensure you import `reflect-metadata` as the first import in your application's entry point.

`index.ts`

```typescript
import 'reflect-metadata';

...
```

Then you can start using joiful like this.

```typescript
import * as jf from 'joiful';

class SignUp {
  @jf.string().required()
  username: string;

  @jf
    .string()
    .required()
    .min(8)
  password: string;

  @jf.date()
  dateOfBirth: Date;

  @jf.boolean().required()
  subscribedToNewsletter: boolean;
}

const signUp = new SignUp();
signUp.username = 'rick.sanchez';
signUp.password = 'wubbalubbadubdub';

const { error } = jf.validate(signUp);

console.log(error); // Error will either be undefined or a standard joi validation error
```

## Validate plain old javascript objects

Don't like creating instances of classes? Don't worry, you don't have to. You can validate a plain old javascript object as if it were an instance of a class.

```typescript
const signUp = {
  username: 'rick.sanchez',
  password: 'wubbalubbadubdub',
};

const result = jf.validateAsClass(signUp, SignUp);
```

## Custom decorator constraints

Want to create your own shorthand versions of decorators? Simply create a function like below.

`customDecorators.ts`

```typescript
import * as jf from 'joiful';

const password = () =>
  jf
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .required();
```

`changePassword.ts`

```typescript
import { password } from './customDecorators';

class ChangePassword {
  @password()
  newPassword: string;
}
```

## Validating array properties

```typescript
class SimpleTodoList {
  @jf.array().items(joi => joi.string())
  todos?: string[];
}
```

To validate an array of objects that have their own joiful validation:

```typescript
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
```

## Validating object properties

To validate an object subproperty that has its own joiful validation:

```typescript
class Address {
  @string()
  line1?: string;

  @string()
  line2?: string;

  @string().required()
  city!: string;

  @string().required()
  state!: string;

  @string().required()
  country!: string;
}

class Contact {
  @string().required()
  name!: string;

  @object().optional()
  address?: Address;
}
```

## Got a question?

The joiful API is designed to closely match the joi API. One exception is validating the length of a `string`, `array`, etc, which is performed using `.exactLength(n)` rather than `.length(n)`. If you're familiar with the joi API, you should find joiful very easy to pickup.

If there's something you're not sure of you can see how it's done by looking at the unit tests. There is 100% coverage so most likely you'll find your scenario there. Otherwise feel free to [open an issue](https://github.com/joiful-ts/joiful/issues).

## Contributing

Got an issue or a feature request? [Log it](https://github.com/joiful-ts/joiful/issues).

[Pull-requests](https://github.com/joiful-ts/joiful/pulls) are also very welcome.

## Alternatives

- [class-validator](https://github.com/typestack/class-validator): usable in both Node.js and the browser. Mostly designed for validating string values. Can't validate plain objects, only class instances.
- [joi-extract-type](https://github.com/TCMiranda/joi-extract-type): provides native type extraction from Joi Schemas. Augments the Joi type definitions.
- [typesafe-joi](https://github.com/hjkcai/typesafe-joi): automatically infers type information of validated objects, via the standard Joi schema API.
