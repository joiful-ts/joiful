import 'reflect-metadata';
import {Validator} from "./Validator";
import {SCHEMA_KEY} from "./core";
import {MultipleValidationError} from "./MultipleValidationError";
import {ValidationError} from "joi";

export function Validate(validator : Validator) : MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let original = descriptor.value;
        descriptor.value = function (...args : any[]) {
            let types = Reflect.getMetadata("design:paramtypes", target, propertyKey);
            let failures : ValidationError[] = [];
            let newArgs : any[] = [];
            for (let i = 0; i < args.length; i++) {
                let arg = args[i];
                let argType = types[i];
                let schema = Reflect.getMetadata(SCHEMA_KEY, argType.prototype);
                if (schema) {
                    let result = validator.validateAsClass(arg, argType);
                    if (result.error != null) {
                        failures.push(result.error);
                    }
                    newArgs.push(result.value);
                } else {
                    newArgs.push(arg);
                }
            }
            if (failures.length > 0) {
                throw new MultipleValidationError(failures);
            } else {
                return original.apply(this, newArgs);
            }
        };
        return descriptor;
    }
}
