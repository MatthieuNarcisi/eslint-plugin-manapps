/**
 * @fileoverview Prevent subscribing to observables in tests. Use firstValueFrom and return expect(...).resolves.to... instead.
 * @author Massil TAGUEMOUT
 */

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/no-subscribe-in-tests';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'noSubscribeInTests'> = {
  messageId: 'noSubscribeInTests',
};

const ruleTester = new RuleTester();

ruleTester.run('no-subscribe-in-tests', rule, {
  valid: [
    {
      code: `
        import { firstValueFrom } from 'rxjs';
        it('resolves observable value', async () => {
          const result = await firstValueFrom(myObservable);
          expect(result).toBe(expectedValue);
        });
      `,
      filename: 'my-component.spec.ts',
    },
    {
      code: `
        import { firstValueFrom } from 'rxjs';
        it('resolves observable value', () => {
          return expect(firstValueFrom(myObservable)).resolves.toBe(expectedValue);
        });
      `,
      filename: 'my-component.spec.ts',
    },
    {
      code: `
        import { of } from 'rxjs';
        it('handles synchronous observables', async () => {
          const result = await firstValueFrom(of(42));
          expect(result).toBe(42);
        });
      `,
      filename: 'my-component.spec.ts',
    },
  ],

  invalid: [
    {
      code: `
        it('returns expected value', () => {
          myObservable.subscribe(value => {
            expect(value).toBe(expectedValue);
          });
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        it('returns expected value', () => {
          const subscription = myObservable.subscribe(value => {
            expect(value).toBe(expectedValue);
          });
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        it('uses subscribe', async () => {
          myObservable.subscribe(value => {
            expect(value).toBe(expectedValue);
          });
        });
      `,
      filename: 'my-component.test.ts',
      errors: [error],
    },
    {
      code: `
        describe('MyComponent', () => {
          it('uses subscribe', () => {
            service.getData().subscribe(data => {
              expect(data).toEqual(mockData);
            });
          });
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
  ],
});
