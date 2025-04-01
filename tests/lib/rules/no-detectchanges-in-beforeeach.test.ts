/**
 * @fileoverview Disallow componentFixture.detectChanges() inside beforeEach in test files
 * @author Massil TAGUEMOUT
 */
'use strict';

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/no-detectchanges-in-beforeeach';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'noDetectChangesInBeforeEach'> = {
  messageId: 'noDetectChangesInBeforeEach',
};

const ruleTester = new RuleTester();

ruleTester.run('no-detectchanges-in-beforeeach', rule, {
  valid: [
    {
      code: `
        beforeEach(() => {
          componentFixture = TestBed.createComponent(MyComponent);
        });
      `,
      filename: 'my-component.spec.ts',
    },
    {
      code: `
        it('should call detectChanges', () => {
          componentFixture.detectChanges();
        });
      `,
      filename: 'my-component.spec.ts',
    },
    {
      code: `
        describe('MyComponent', () => {
          beforeEach(() => {
            componentFixture = TestBed.createComponent(MyComponent);
          });
          it('should detect changes', () => {
            componentFixture.detectChanges();
          });
        });
      `,
      filename: 'my-component.spec.ts',
    },
  ],

  invalid: [
    {
      code: `
        beforeEach(() => {
          const componentFixture = TestBed.createComponent(MyComponent);
          componentFixture.detectChanges();
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        beforeEach(() => {
          let fixture = TestBed.createComponent(MyComponent);
          fixture.detectChanges();
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        beforeEach(() => {
          fixture = TestBed.createComponent(MyComponent);
          fixture.detectChanges();
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
    {
      code: `
        describe('MyComponent', () => {
          beforeEach(() => {
            let componentFixture = TestBed.createComponent(MyComponent);
            componentFixture.detectChanges();
          });
          it('should do something', () => {});
        });
      `,
      filename: 'my-component.spec.ts',
      errors: [error],
    },
  ],
});
