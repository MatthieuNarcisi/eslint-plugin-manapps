/**
 * @fileoverview Allow only a single describe at top level in test file
 * @author Bastien BIELMANN
 */

import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const TEST_FILE_SUFFIXES = ['test.ts', 'spec.ts'];

export default createRule({
  name: 'only-single-top-level-describe-in-test-file',
  defaultOptions: [],
  meta: {
    messages: {
      onlySingleTopLevelDescribe: 'You should not have more than 1 describe at top level in your test.',
    },
    type: 'problem',
    docs: {
      description: 'Allow only a single describe at top level in test file.',
    },
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // https://eslint.org/docs/latest/extend/selectors
      // Adjacent sibling not descendent of a describe expression
      'ExpressionStatement:has(Identifier[name="describe"]) + :not(ExpressionStatement ExpressionStatement):has(Identifier[name="describe"])':
        (node: TSESTree.ExpressionStatement) => {
          const filename = context.getPhysicalFilename();

          const isInTestFile = TEST_FILE_SUFFIXES.some((suffix) => filename.endsWith(suffix));

          if (!isInTestFile) {
            return;
          }

          const callee = (node.expression as TSESTree.CallExpression).callee;
          context.report({
            messageId: 'onlySingleTopLevelDescribe',
            loc: callee.loc,
          });
        },
    };
  },
});
