/**
 * @fileoverview Disallow the usage of the store object in components
 * @author Matthieu Narcisi
 */
import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const STORE_CLASS_NAME = 'Store';
const COMPONENT_SUFFIX = 'Component';

/** @type {import('eslint').Rule.RuleModule} */
export default createRule({
  name: 'no-store-in-components',
  defaultOptions: [],
  meta: {
    messages: {
      noStore: "You should not use the Store object in '{{ component }}'",
    },
    type: 'problem',
    docs: {
      description: 'Disallow the usage of the store object in components',
    },
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      MethodDefinition: (node) => {
        if (node.kind !== 'constructor') {
          return;
        }

        let className: string | undefined = undefined;
        let parent: any = node.parent;

        while (!className && parent) {
          if (parent.type === AST_NODE_TYPES.ClassDeclaration) {
            className = parent.id?.name;
          }

          parent = parent.parent;
        }

        if (!className?.endsWith(COMPONENT_SUFFIX)) {
          return;
        }

        (node.value.params as Array<TSESTree.Identifier>).forEach((param: TSESTree.BaseNode) => {
          let parameter = param as TSESTree.Identifier;

          if (param.type === AST_NODE_TYPES.TSParameterProperty) {
            parameter = (param as TSESTree.TSParameterProperty).parameter as TSESTree.Identifier;
          }

          if (
            parameter.typeAnnotation?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
            (parameter.typeAnnotation?.typeAnnotation.typeName as TSESTree.Identifier).name === STORE_CLASS_NAME
          ) {
            context.report({
              node: parameter,
              messageId: 'noStore',
              data: { component: className },
            });
          }
        });
      },
    };
  },
});
