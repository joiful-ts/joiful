# joiful
#### TypeScript Declarative Validation for Joi

[![npm version](https://badge.fury.io/js/joiful.svg)](https://badge.fury.io/js/joiful)
[![CircleCI](https://circleci.com/gh/joiful-ts/joiful.svg?style=shield)](https://circleci.com/gh/joiful-ts/joiful)

This lib allows you to apply Joi validation constraints on class properties, by using decorators.

This means you can combine your type schema and your validation schema in one go!

Calling `Validator.validateAsClass()` allows you to validate any object as if it were an instance of a given class.


## Installation

`npm add joiful`

Or

`yarn add joiful`.

You must enable experimental decorators and metadata in your TypeScript configuration.

`tsconfig.json`
```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
    }
}
```


## Basic Usage

```typescript
import * as jf from 'joiful';

class SignUp {
	@jf.string().required()
    username: string;

    @jf.string().required().min(8)
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
    password: 'wubbalubbadubdub'
};

const result = jf.validateAsClass(signUp, SignUp);
```

## Custom decorator constraints
Want to create your own shorthand versions of decorators? Simply create a function like below.

`customDecorators.ts`
```typescript
import * as jf from 'joiful';

const password = () => jf.string()
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


## Contributing
Got an issue or a feature request? [Log it](https://github.com/joiful-ts/joiful/issues).

[Pull-requests](https://github.com/joiful-ts/joiful/pulls) are also welcome.


## Alternatives

- [class-validator](https://github.com/typestack/class-validator): usable in both Node.js and the browser. Mostly designed for validating string values. Can't validate plain objects, only class instances.
- [joi-extract-type](https://github.com/TCMiranda/joi-extract-type): provides native type extraction from Joi Schemas. Augments the Joi type definitions.
- [typesafe-joi](https://github.com/hjkcai/typesafe-joi): automatically infers type information of validated objects, via the standard Joi schema API.

