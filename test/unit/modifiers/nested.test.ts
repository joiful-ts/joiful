import { testConstraint } from '../testUtil';
import { Joiful } from '../../../src/joiful';
import { NestedPropertyTypeUnknown } from '../../../src/modifiers/nested';

let jf: Joiful;

describe('nested', () => {
  beforeEach(() => jf = new Joiful());

  testConstraint(
    () => {
      class Address {
        line1?: string;
        line2?: string;

        @jf.string().required()
        city!: string;

        @jf.string().required()
        state!: string;

        @jf.string().required()
        country!: string;
      }

      class Contact {
        @jf.string().required()
        name!: string;

        @jf.nested().optional()
        address?: Address;
      }

      return Contact;
    },
    [
      {
        name: 'John Smith',
        address: {
          city: 'Melbourne',
          state: 'Victoria',
          country: 'Australia',
        },
      },
      {
        name: 'Jane Smith',
      },
    ],
    [
      {
        name: 'Joe Shabadoo',
        address: {
        } as any,
      },
    ],
  );

  it('should allow explicitly specifying the nested property type', () => {
    class Address {
      line1?: string;
      line2?: string;

      @jf.string().required()
      city!: string;

      @jf.string().required()
      state!: string;

      @jf.string().required()
      country!: string;
    }

    class Contact {
      @jf.string().required()
      name!: string;

      @jf.nested(Address).optional()
      address?: Address;
    }

    expect({
      name: 'John Smith',
      address: {
        city: 'Melbourne',
        state: 'Victoria',
        country: 'Australia',
      },
    }).toBeValid({ Class: Contact });
  });

  it('should error when a nested property does not have a type of class', () => {
    expect(() => {
      class User {
        @jf.nested().required()
        public facebookProfile!: { profileName: string };
      }
      return User;
    }).toThrow(new NestedPropertyTypeUnknown('facebookProfile'));
  });
});
