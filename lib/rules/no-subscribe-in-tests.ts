/**
 * @fileoverview Prevent subscribing to observables in tests. Use firstValueFrom and return expect(...).resolves.to... instead.
 * @author Massil TAGUEMOUT
 */

import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const TEST_FILE_SUFFIXES = ['test.ts', 'spec.ts'];

export default createRule({
  name: 'no-subscribe-in-tests',
  defaultOptions: [],
  meta: {
    messages: {
      noSubscribeInTests: "Do not use '.subscribe()' in test files. Use 'firstValueFrom(observable)' and 'return expect(...).resolves.to...' instead.",
    },
    type: 'problem',
    docs: {
      description: "Prevent the use of .subscribe() in test files and enforce the use of firstValueFrom() with return expect(...).resolves.to...",
    },
    schema: [],
  },

  create(context) {
    const filename = context.physicalFilename;
    const isInTestFile = TEST_FILE_SUFFIXES.some((suffix) => filename.endsWith(suffix));

    if (!isInTestFile) {
      return {};
    }

    return {
      "CallExpression[callee.type='MemberExpression'][callee.property.name='subscribe']"(node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId: 'noSubscribeInTests',
        });
      },
    };
  },
});
