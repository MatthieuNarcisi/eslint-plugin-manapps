/**
 * @fileoverview Disallow the usage of should at the start of test definition
 * @author Matthieu Narcisi
 */
'use strict';

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/no-should-in-test-name';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'noShould'> = {
  messageId: 'noShould',
};

const ruleTester = new RuleTester();
ruleTester.run('no-should-in-test-name', rule, {
  valid: [
    { code: "it('should do something', () => {});", filename: 'service.ts' },
    { code: "it('does something', () => {});", filename: 'service.spec.ts' },
    { code: "it('does not do something', () => {});", filename: 'service.spec.ts' },
    { code: "it('creates something', () => {});", filename: 'service.spec.ts' },
  ],

  invalid: [
    {
      code: "it('should do something', () => {});",
      filename: 'service.spec.ts',
      errors: [error],
      output: "it('does something', () => {});",
    },
    {
      code: "it('should not do something', () => {});",
      filename: 'service.spec.ts',
      errors: [error],
      output: "it('does not do something', () => {});",
    },
    {
      code: "it('should create something', () => {});",
      filename: 'service.spec.ts',
      errors: [error],
      output: "it('creates something', () => {});",
    },
  ],
});
