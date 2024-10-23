/**
 * @fileoverview Allow only a single describe at top level in test file
 * @author Bastien BIELMANN
 */
'use strict';

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/only-single-top-level-describe-in-test-file';
import { multipleDescribeAtTopLevelExample2, multipleDescribeAtTopLevelExample1, onlyOneDescribeAtTopLevelExample, otherThanDescribeAtTopLevelExample } from '../constants/exemple-file';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'onlySingleTopLevelDescribe'> = {
  messageId: 'onlySingleTopLevelDescribe',
};

const ruleTester = new RuleTester();
ruleTester.run('only-single-top-level-describe-in-test-file', rule, {
  valid: [
    { code: multipleDescribeAtTopLevelExample1, filename: 'service.ts' },
    { code: onlyOneDescribeAtTopLevelExample, filename: 'service.spec.ts' },
    { code: otherThanDescribeAtTopLevelExample, filename: 'service.spec.ts' },
  ],
  invalid: [
    {
      code: multipleDescribeAtTopLevelExample1,
      filename: 'service.spec.ts',
      errors: [error],
    },
    {
      code: multipleDescribeAtTopLevelExample2,
      filename: 'service.spec.ts',
      errors: [error, error],
    },
  ],
});
