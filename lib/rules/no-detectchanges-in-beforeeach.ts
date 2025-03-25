/**
 * @fileoverview Disallow componentFixture.detectChanges() inside beforeEach in test files
 * @author Massil TAGUEMOUT
 */

import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const TEST_FILE_SUFFIXES = ['test.ts', 'spec.ts'];

export default createRule({
  name: 'no-detectchanges-in-beforeeach',
  defaultOptions: [],
  meta: {
    messages: {
      noDetectChangesInBeforeEach: "Do not call 'componentFixture.detectChanges()' inside a beforeEach block.",
    },
    type: 'problem',
    docs: {
      description: "Ensure 'componentFixture.detectChanges()' is not used inside a beforeEach block in test files.",
    },
    schema: [],
  },

  create(context) {
    const filename = context.physicalFilename;
    const isInTestFile = TEST_FILE_SUFFIXES.some((suffix) => filename.endsWith(suffix));

    if (!isInTestFile) {
      return {};
    }

    // Set of componentFixture variables
    const componentFixtureVariables = new Set<string>();

    return {
      // Match declarations of componentFixture and store their identifiers in the set
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (
          node.init &&
          node.init.type === AST_NODE_TYPES.CallExpression &&
          node.init.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.init.callee.object.type === AST_NODE_TYPES.Identifier &&
          node.init.callee.object.name === 'TestBed' &&
          node.init.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.init.callee.property.name === 'createComponent' &&
          node.id.type === AST_NODE_TYPES.Identifier
        ) {
          componentFixtureVariables.add(node.id.name);
        }
      },

      // Match assignments of componentFixture and store their identifiers in the set
      AssignmentExpression(node: TSESTree.AssignmentExpression) {
        if (
          node.right.type === AST_NODE_TYPES.CallExpression &&
          node.right.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.right.callee.object.type === AST_NODE_TYPES.Identifier &&
          node.right.callee.object.name === 'TestBed' &&
          node.right.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.right.callee.property.name === 'createComponent'
        ) {
          if (node.left.type === AST_NODE_TYPES.Identifier) {
            componentFixtureVariables.add(node.left.name);
          }
        }
      },

      // Check if detectChanges() is used inside a beforeEach block
      "CallExpression[callee.type='MemberExpression'][callee.property.name='detectChanges']"(node: TSESTree.CallExpression) {
        const callee = node.callee as TSESTree.MemberExpression;
        if (callee.object.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        if (!componentFixtureVariables.has(callee.object.name)) {
          return;
        }

        const ancestors = context.sourceCode.getAncestors(node);
        if (
          ancestors.some(
            (ancestor) =>
              ancestor.type === AST_NODE_TYPES.CallExpression &&
              ancestor.callee.type === AST_NODE_TYPES.Identifier &&
              ancestor.callee.name === 'beforeEach'
          )
        ) {
          context.report({ node, messageId: 'noDetectChangesInBeforeEach' });
        }
      },
    };
  },
});
