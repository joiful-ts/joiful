# tsdv-joi - TypeScript Declarative Validation for Joi

[![CircleCI](https://circleci.com/gh/laurence-myers/tsdv-joi.svg?style=shield)](https://circleci.com/gh/laurence-myers/tsdv-joi)

This lib allows you to apply Joi validation constraints on class properties, by using decorators.

This means you can combine your type schema and your validation schema in one go!

Calling `Validator.validateAsClass()` allows you to validate any object as if it were an instance of a given class.

## Installation

You must enable experimental decorators and metadata in your TypeScript configuration.

## Usage

```
// ...imports...

registerJoi(Joi);

class MyClass {
	@Max(5)
	@Min(2)
	@StringSchema
	public myProperty : string;
}

let instance = new MyClass();
instance.myProperty = "a";

const validator = new Validator();
var result = validator.validate(instance);
console.log(result); // outputs the Joi returned value
```

## Custom constraints

You can provide your own decorators to chain together Joi constraints.

```
export function RequiredPositiveInteger() : PropertyDecorator {
    return constraintDecorator([Number], (schema : NumberSchema) => {
        return schema.required().positive().integer().min(1);
    });
}

class MyClass {
    @RequiredPositiveInteger()
    public myProperty : number;
}
```

If you want to provide your own validation functions, you can use Joi's "extend" functionality, and register your
instance of Joi with tsdv-joi by calling `core/registerJoi()`. Refer to the Joi documentation for details on extending
Joi.

## TODO:

- Tests! Tests! TEEEESSSSTTS!
- Custom constraints without having to extend Joi.
- Don't make the registered Joi module a singleton.
- Abstract message into property keys (for i18n support). (Can be achieved through validator config)
- Support some object constraints at the class level, e.g. and/nand/or/xor.
- Support "alternatives", other Joi functions.

## Alternatives

- [class-validator](https://github.com/typestack/class-validator): usable in both Node.js and the browser. Mostly designed for validating string values. Can't validate plain objects, only class instances.