import './metadataShim';
import { Validator, InvalidTarget } from '../../src/Validator';
import { StringSchema } from '../../src/constraints/string';

class Login {
    @StringSchema()
    emailAddress?: string;

    @StringSchema()
    password?: string;
}

describe('Validator', () => {
    let validator: Validator;
    let login: Login;

    beforeEach(() => {
        validator = new Validator();

        login = new Login();
        login.emailAddress = 'joe@example.com';
    });

    describe('constructor', () => {
        it('should use validation options of the Joi instance by default', () => {
            const result = validator.validate(login);
            expect(result.value).toEqual(login);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            validator = new Validator({ presence: 'required' });
            const result = validator.validate(login);
            expect(result.value).toEqual(login);
            expect(result.error).toBeTruthy();
        });
    });

    describe('validate', () => {
        it('should validate an instance of a decorated class', () => {
            const result = validator.validate(login);
            expect(result.value).toEqual(login);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            const result = validator.validate(login, { presence: 'required' });
            expect(result.value).toEqual(login);
            expect(result.error).toBeTruthy();
        });

        it('should error when trying to validate null', () => {
            expect(() => validator.validate(null)).toThrowError(new InvalidTarget('object'));
        });
    });

    describe('validateAsClass', () => {
        it('should accept a plain old javascript object to validate', () => {
            const result = validator.validateAsClass({ ...login }, Login);
            expect(result.value).toEqual(login);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            const result = validator.validateAsClass({ ...login }, Login, { presence: 'required' });
            expect(result.value).toEqual(login);
            expect(result.error).toBeTruthy();
        });

        it('should error when trying to validate null', () => {
            expect(() => validator.validateAsClass(null, Login)).toThrowError(new InvalidTarget('object'));
        });
    });

    describe('validateArrayAsClass', () => {
        it('should accept an array of plain old javascript objects to validate', () => {
            const result = validator.validateArrayAsClass([{ ...login }], Login);
            expect(result.value).toEqual([login]);
            expect(result.error).toBe(null);
        });

        it('should optionally accept validation options to use', () => {
            const result = validator.validateArrayAsClass([{ ...login }], Login, { presence: 'required' });
            expect(result.value).toEqual([login]);
            expect(result.error).toBeTruthy();
        });

        it('should error when trying to validate null', () => {
            expect(
                () => validator.validateArrayAsClass(null as any, Login),
            ).toThrowError(new InvalidTarget('array'));
        });
    });
});
