# TSDV-Joi - TypeScript Declarative Validation for Joi

This lib allows you to apply Joi validation constraints on class properties, by using decorators.

This means you can combine your type schema and your validation schema in one go!

```
class MyClass {
	@Max(5)
	@Min(2)
	@StringSchema
	var myProperty : string;
}
```

Calling `Validator.validateAsClass()` allows you to validate any object as if it were a class.
Be careful, methods could be missing from the resulting object, unless you specifically add function constraints to each
method.