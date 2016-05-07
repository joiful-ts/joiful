# TSDV-Joi - TypeScript Declarative Validation for Joi

This lib allows you to apply Joi validation constraints on class properties, by using decorators.

This means you can combine your type schema and your validation schema in one go!

Calling `Validator.validateAsClass()` allows you to validate any object as if it were a class.
Be careful, methods could be missing from the resulting object, unless you specifically add function constraints to each
method.

## Installation

You must enable experimental decorators and metadata in your TypeScript configuration.

## Usage

```
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

## TODO:

- Tests! Tests! TEEEESSSSTTS!
- Custom constraints?
- Abstract message into property keys (for i18n support).
- Support some object constraints at the class level, e.g. and/nand/or/xor.
- Support "alternatives", other Joi functions.
