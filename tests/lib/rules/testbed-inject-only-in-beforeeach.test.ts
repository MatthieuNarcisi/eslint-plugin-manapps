/**
 * @fileoverview Enforce TestBed.inject is only called inside beforeEach in test files
 * @author Massil TAGUEMOUT
 */

'use strict';

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/testbed-inject-only-in-beforeeach';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'testBedInjectOnlyInBeforeEach'> = {
  messageId: 'testBedInjectOnlyInBeforeEach',
};

const ruleTester = new RuleTester();

ruleTester.run('testbed-inject-only-in-beforeeach', rule, {
  valid: [
    {
      code: `
        beforeEach(() => {
          const myService = TestBed.inject(MyService);
        });
        
        it('should inject service', () => {
          // No inject here
        });
      `,
      filename: 'my-component.spec.ts',
    },
  ],

  invalid: [
    {
      code: `
        it('should inject service', () => {
          const myService = TestBed.inject(MyService);
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        describe('MyComponent', () => {
          beforeEach(() => {
            // No inject
          });
          it('should do something', () => {
            const myService = TestBed.inject(MyService);
          });
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        describe('MyComponent', () => {
          beforeEach(() => {
            const myService = TestBed.inject(MyService);
          });
          it('should do something', () => {
            const mySecondService = TestBed.inject(MySecondService);
          });
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
  ],
});
