/**
 * @fileoverview Prevent subscribing to observables in tests. Use firstValueFrom and return expect(...).resolves.to... instead.
 * @author Massil TAGUEMOUT
 */

import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const TEST_FILE_SUFFIXES = ['test.ts', 'spec.ts'];

export default createRule({
  name: 'no-subscribe-in-tests',
  defaultOptions: [],
  meta: {
    messages: {
      noSubscribeInTests: "Do not use '.subscribe()' on an Observable in test files. Use 'firstValueFrom(observable)' and 'return expect(...).resolves.to...' instead.",
    },
    type: 'problem',
    docs: {
      description: "Prevent the use of .subscribe() on Observables in test files and enforce the use of firstValueFrom() with return expect(...).resolves.to...",
    },
    schema: [],
  },

  create(context) {
    const filename = context.physicalFilename;
    const isInTestFile = TEST_FILE_SUFFIXES.some((suffix) => filename.endsWith(suffix));

    if (!isInTestFile) {
      return {};
    }

    // Store variables of type Observable
    const observableVariables = new Set<string>();

    // List of RxJS functions that return Observables
    const observableCreationMethods = new Set(["ajax", "bindCallback", "bindNodeCallback", "defer",
      "empty", "from", "fromEvent", "fromEventPattern", "generate", "interval", "of", "range", "throwError", "timer",
      "concat", "forkJoin", "merge", "race", "zip", "combineLatest", "partition"]);

    return {
      // Detect imports of Observable class and methods from package 'rxjs'
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value === 'rxjs') {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === AST_NODE_TYPES.ImportSpecifier &&
              observableCreationMethods.has(specifier.imported.name)
            ) {
              observableVariables.add(specifier.local.name);
            }
          }
        }
      },

      // Catch variables declared as Observables
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (!node.id || node.id.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        const variableName = node.id.name;

        // Check if the Observable is created with `new Observable()`
        if (
          node.init &&
          node.init.type === AST_NODE_TYPES.NewExpression &&
          node.init.callee.type === AST_NODE_TYPES.Identifier &&
          node.init.callee.name === 'Observable'
        ) {
          observableVariables.add(variableName);
          return;
        }

        // Check if the Observable is created with an RxJS method (`of()`, `from()`, etc.)
        if (
          node.init &&
          node.init.type === AST_NODE_TYPES.CallExpression &&
          node.init.callee.type === AST_NODE_TYPES.Identifier &&
          observableCreationMethods.has(node.init.callee.name)
        ) {
          observableVariables.add(variableName);
          return;
        }
      },

      // Catch calls to `.subscribe()` on objects identified as Observables
      "CallExpression[callee.type='MemberExpression'][callee.property.name='subscribe']"(
        node: TSESTree.CallExpression
      ) {
        const object = node.callee as TSESTree.MemberExpression;

        if (object.object.type === AST_NODE_TYPES.Identifier) {
          const objectName = object.object.name;

          // Check if caller object is an Observable
          if (observableVariables.has(objectName)) {
            context.report({
              node,
              messageId: 'noSubscribeInTests',
            });
          }
        }
      },
    };
  },
});
