import { Validator } from '../../src/validation';
import { Joiful } from '../../src/joiful';

describe('messages', () => {
    let jf: Joiful;

    beforeEach(() => {
        jf = new Joiful();
    });

    it('default message', () => {
        let validator = new Validator();

        class VerificationCode {
            @jf.string().exactLength(6)
            public code!: string;
        }

        let instance = new VerificationCode();
        instance.code = 'abc';

        let result = validator.validate(instance);
        expect(result).toHaveProperty('error');
        expect(result.error).not.toBeNull();
        expect(result.error!.details[0].message).toEqual('"code" length must be 6 characters long');
    });
});
