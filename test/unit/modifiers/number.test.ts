import { testConstraint } from '../testUtil';
import { Joiful } from '../../../src/joiful';
import { Validator } from '../../../src/validation';

describe('number', () => {
  let jf: Joiful;

  beforeEach(() => jf = new Joiful());

  testConstraint(
    () => {
      class AgeVerificationForm {
        @jf.number()
        age?: number;
      }
      return AgeVerificationForm;
    },
    [{ age: 18 }, {}],
    [{ age: 'like way old' as any }],
  );

  describe('greater', () => {
    testConstraint(
      () => {
        class AgeVerificationForm {
          @jf.number().greater(17)
          age?: number;
        }
        return AgeVerificationForm;
      },
      [{ age: 18 }],
      [{ age: 17 }],
    );
  });

  describe('integer', () => {
    testConstraint(
      () => {
        class CatAdoptionForm {
          @jf.number().integer()
          catCount?: number;
        }
        return CatAdoptionForm;
      },
      [{ catCount: 3 }, { catCount: 50 }],
      [{ catCount: 0.5 }],
    );
  });

  describe('less', () => {
    testConstraint(
      () => {
        class CatAdoptionForm {
          @jf.number().less(10)
          catCount?: number;
        }
        return CatAdoptionForm;
      },
      [{ catCount: 1 }],
      [{ catCount: 10 }],
    );
  });

  describe('max', () => {
    testConstraint(
      () => {
        class CatAdoptionForm {
          @jf.number().max(9)
          catCount?: number;
        }
        return CatAdoptionForm;
      },
      [{ catCount: 1 }],
      [{ catCount: 10 }],
    );
  });

  describe('min', () => {
    testConstraint(
      () => {
        class CatAdoptionForm {
          @jf.number().min(1)
          catCount?: number;
        }
        return CatAdoptionForm;
      },
      [{ catCount: 1 }],
      [{ catCount: 0 }],
    );
  });

  describe('multiple', () => {
    testConstraint(
      () => {
        class GamingConsole {
          @jf.number().multiple(8)
          bits?: number;
        }
        return GamingConsole;
      },
      [{ bits: 8 }, { bits: 16 }, { bits: 32 }, { bits: 64 }],
      [{ bits: 4 }, { bits: 10 }],
    );
  });

  describe('negative', () => {
    testConstraint(
      () => {
        class Adjustment {
          @jf.number().negative()
          amount?: number;
        }
        return Adjustment;
      },
      [{ amount: -1 }, { amount: -1.1 }],
      [{ amount: 1 }, { amount: 0 }],
    );
  });

  describe('positive', () => {
    testConstraint(
      () => {
        class WorkplaceStatus {
          @jf.number().positive()
          daysSinceLastAccident?: number;
        }
        return WorkplaceStatus;
      },
      [{ daysSinceLastAccident: 1 }],
      [{ daysSinceLastAccident: -1 }, { daysSinceLastAccident: 0 }],
    );
  });

  describe('precision', () => {
    describe('with strict mode', () => {
      testConstraint(
        () => {
          class Deposit {
            @jf.number().strict().precision(2)
            amount?: number;
          }
          return Deposit;
        },
        [{ amount: 1.11 }, { amount: 1.1 }, { amount: 1 }],
        [{ amount: 1.123 }],
      );
    });

    describe('without strict mode', () => {
      it('should pass validation but round the value', () => {
        const getDepositClass = () => {
          class Deposit {
            @jf.number().precision(2)
            amount?: number;
          }
          return Deposit;
        };

        const deposit = new (getDepositClass())();
        deposit.amount = 1.009;

        const validator = new Validator();
        let result = validator.validate(deposit);

        expect(result.error).toBeNull();
        expect(result.value).not.toEqual(deposit);
        expect(result.value).toEqual({ amount: 1.01 });

        deposit.amount = 1.001;
        result = validator.validate(deposit);

        expect(result.value).toEqual({ amount: 1 });
      });
    });
  });
});
