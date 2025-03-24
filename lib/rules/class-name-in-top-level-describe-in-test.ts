/**
 * @fileoverview Ensure the tested class name is in the top-level describe of a unit test file
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
  name: 'tested-class-name-in-top-level-describe',
  defaultOptions: [],
  meta: {
    messages: {
      missingClassNameInDescribe: "The top-level describe should include the tested class name '{{ className }}'.",
    },
    type: 'problem',
    docs: {
      description: 'Ensure the tested class name is in the top-level describe of a unit test.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.physicalFilename;
    const isInTestFile = TEST_FILE_SUFFIXES.some((suffix) => filename.endsWith(suffix));

    if (!isInTestFile) {
      return {};
    }

    const match = filename.match(/([^/\\]+?)(?:\.spec|\.test)\.ts$/);
    const className = match
      ? match[1]
        .split(/[-.]/) // Split on "-" and "."
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Convert to PascalCase
        .join('')
      : undefined;

    console.log('className', className);

    return {
      'ExpressionStatement > CallExpression[callee.name="describe"]': (node: TSESTree.CallExpression) => {
        if (!className) return;

        // Ensure this is the top-level describe
        if (context.sourceCode.getAncestors(node).some(ancestor => ancestor.type === AST_NODE_TYPES.CallExpression && ancestor.callee.type === 'Identifier' && ancestor.callee.name === 'describe')) {
          return; // Skip nested describes
        }

        const firstArgument = node.arguments[0];
        if (
          firstArgument &&
          firstArgument.type === AST_NODE_TYPES.Literal &&
          typeof firstArgument.value === 'string' &&
          !firstArgument.value.includes(className)
        ) {
          context.report({
            node: firstArgument,
            messageId: 'missingClassNameInDescribe',
            data: { className },
          });
        }
      },
    };
  },
});
