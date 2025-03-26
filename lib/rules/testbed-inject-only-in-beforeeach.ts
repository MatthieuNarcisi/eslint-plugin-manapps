/**
 * @fileoverview Enforce TestBed.inject is only called inside beforeEach in test files
 * @author Massil TAGUEMOUT
 */

import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const TEST_FILE_SUFFIXES = ['test.ts', 'spec.ts'];

export default createRule({
  name: 'testbed-inject-only-in-beforeeach',
  defaultOptions: [],
  meta: {
    messages: {
      testBedInjectOnlyInBeforeEach: "Do not call 'TestBed.inject' outside of a beforeEach block.",
    },
    type: 'problem',
    docs: {
      description: "Ensure that TestBed.inject is only called inside beforeEach blocks in test files.",
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
      // Catch call to TestBed.inject
      "CallExpression[callee.type='MemberExpression'][callee.object.name='TestBed'][callee.property.name='inject']"(node: TSESTree.CallExpression) {
        // Check if the call is inside a beforeEach
        const ancestors = context.sourceCode.getAncestors(node);
        const isInBeforeEach = ancestors.some(
          (ancestor) =>
            ancestor.type === AST_NODE_TYPES.CallExpression &&
            ancestor.callee.type === AST_NODE_TYPES.Identifier &&
            ancestor.callee.name === 'beforeEach'
        );

        if (!isInBeforeEach) {
          context.report({
            node,
            messageId: 'testBedInjectOnlyInBeforeEach',
          });
        }
      },
    };
  },
});
