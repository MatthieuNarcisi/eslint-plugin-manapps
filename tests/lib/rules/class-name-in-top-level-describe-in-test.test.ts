/**
 * @fileoverview Ensure the tested class name is present in the top-level describe of a unit test file
 * @author Massil TAGUEMOUT
 */
'use strict';

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/class-name-in-top-level-describe-in-test';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'missingClassNameInDescribe'> = {
  messageId: 'missingClassNameInDescribe',
};

const ruleTester = new RuleTester();
ruleTester.run('tested-class-name-in-top-level-describe', rule, {
  valid: [
    {
      code: "describe('MyService', () => { it('does something', () => {}); });",
      filename: 'my-service.spec.ts',
    },
    {
      code: "describe('UserComponent', () => { it('renders correctly', () => {}); });",
      filename: 'user.component.spec.ts',
    },
    {
      code: "describe('PaymentMethodsStep1FormComponent', () => { it('renders correctly', () => {}); });",
      filename: 'payment-methods-step1-form.component.spec.ts',
    },
    {
      code: "describe('OrderService', () => { describe('HelperMethods', () => { it('processes orders', () => {}); }); });",
      filename: 'order-service.spec.ts',
    },
  ],

  invalid: [
    {
      code: "describe('HelperMethods', () => { it('processes orders', () => {}); });",
      filename: 'order-service.spec.ts',
      errors: [error],
    },
    {
      code: "describe('SomeOtherDescribe', () => { it('should work', () => {}); });",
      filename: 'user.component.spec.ts',
      errors: [error],
    },
    {
      code: "describe('RandomDescribe', () => { it('executes', () => {}); });",
      filename: 'my-service.spec.ts',
      errors: [error],
    },
  ],
});
