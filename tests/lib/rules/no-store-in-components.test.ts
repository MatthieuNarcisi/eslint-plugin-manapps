/**
 * @fileoverview Disallow the usage of the store object in components
 * @author Matthieu Narcisi
 */
'use strict';

import { RuleTester, TestCaseError } from '@typescript-eslint/rule-tester';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import rule from '../../../lib/rules/no-store-in-components';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const error: TestCaseError<'noStore'> = {
  messageId: 'noStore',
  type: AST_NODE_TYPES.Identifier,
};

const ruleTester = new RuleTester();
ruleTester.run('no-store-in-components', rule, {
  valid: [
    'class Test { }',
    'class TestService { constructor(store: Store) {} }',
    'class TestService { constructor(private store: Store) {} }',
    'class TestHelper { constructor(store: Store) {} }',
    'class TestHelper { constructor(private store: Store) {} }',
    'class TestClass { constructor(store) {} }',
    'class TestClass { constructor(private store) {} }',
    'class Test1Component { constructor() {} }',
    'class Test2Component { constructor(anotherService: AnotherService) {} }',
    'class Test3Component { constructor(store: AnotherService) {} }',
    'class Test4Component { constructor(private store: AnotherService) {} }',
    'class Test5Service { constructor(@Inject(TOKEN) private token: string) {} }',
    'class Test6Component { constructor(@Inject(TOKEN) private token: string) {} }',
  ],

  invalid: [
    {
      code: 'class TestComponent { constructor(store: Store) {} }',
      errors: [error],
    },
    {
      code: 'class TestComponent { constructor(private store: Store) {} }',
      errors: [error],
    },
    {
      code: 'class TestComponent { constructor(container: Store) {} }',
      errors: [error],
    },
    {
      code: 'class TestComponent { constructor(private container: Store) {} }',
      errors: [error],
    },
  ],
});
