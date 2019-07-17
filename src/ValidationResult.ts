import { ValidationError } from '@hapi/joi';

export interface ValidationResultPass<T> {
    error: null;
    value: T;
}

export interface ValidationResultFail<T> {
    error: ValidationError;
    value: T;
}

export type ValidationResult<T> = ValidationResultPass<T> | ValidationResultFail<T>;

export function isValidationPass<T>(
    validationResult: ValidationResult<T>,
): validationResult is ValidationResultPass<T> {
    return !validationResult.error;
}

export function isValidationFail<T>(
    validationResult: ValidationResult<T>,
): validationResult is ValidationResultFail<T> {
    return !!validationResult.error;
}
