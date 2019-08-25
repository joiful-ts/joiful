import { Validator } from '../../src/validation';

interface ToBeValidOptions {
    Class?: { new(...args: any[]): any };
    validator?: Validator;
}

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValid(options?: ToBeValidOptions): void;
        }

        interface Expect {
            toBeValid(options?: ToBeValidOptions): void;
        }
    }
}
