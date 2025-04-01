/**
 * @fileoverview Prevent direct usage of date-fns except in helper files (*.helper.ts).
 * @author Massil TAGUEMOUT
 */

import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

/** @type {import('eslint').Rule.RuleModule} */
export default createRule({
  name: 'no-direct-use-date-fns',
  defaultOptions: [],
  meta: {
    messages: {
      noDirectUseDateFns: "Do not import 'date-fns' directly. Use a helper instead.",
    },
    type: 'problem',
    docs: {
      description: "Ensure that 'date-fns' is not imported directly, except in helper files (*.helper.ts).",
    },
    schema: [],
  },

  create(context) {
    const filename = context.physicalFilename || context.getFilename();

    // Rule not applied to helper files (*.helper.ts)
    if (filename.endsWith('.helper.ts')) {
      return {};
    }

    return {
      // Detect header imports
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value.startsWith('date-fns')) {
          context.report({
            node,
            messageId: 'noDirectUseDateFns',
          });
        }
      },

      // Detect dynamic imports
      ImportExpression(node: TSESTree.ImportExpression) {
        console.log('📥 ImportExpression detected:', node);
        if (
          node.source.type === AST_NODE_TYPES.Literal &&
          typeof node.source.value === 'string' &&
          node.source.value.startsWith('date-fns')
        ) {
          console.log('⚠️ Found invalid dynamic import of date-fns!');
          context.report({
            node,
            messageId: 'noDirectUseDateFns',
          });
        }
      }
    };
  },
});
