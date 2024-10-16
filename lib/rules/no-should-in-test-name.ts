/**
 * @fileoverview Disallow the usage of should at the start of test definition
 * @author Matthieu Narcisi
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { SHOULD_REPLACEMENTS } from '../constants/should-replacements.constants';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/MatthieuNarcisi/eslint-plugin-manapps/tree/master/docs/rules/${name}.md`
);

const TEST_FILE_SUFFIXES = ['test.ts', 'spec.ts'];
const TEST_METHOD_NAMES = ['test', 'it'];
const FORBIDEN_WORD = 'should ';

/** @type {import('eslint').Rule.RuleModule} */
export default createRule({
  name: 'no-should-in-test-name',
  defaultOptions: [],
  meta: {
    messages: {
      noShould: "You should not use 'should' in the name of your test.",
    },
    type: 'problem',
    docs: {
      description: 'Disallow the usage of the should word in a test name.',
    },
    fixable: 'code',
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression: (node) => {
        const filename = context.getPhysicalFilename();

        const isInTestFile = TEST_FILE_SUFFIXES.some((suffix) => filename.endsWith(suffix));

        if (!isInTestFile) {
          return;
        }

        const callee = node.callee;

        if (callee.type === AST_NODE_TYPES.Identifier) {
          if (TEST_METHOD_NAMES.includes(callee.name)) {
            if (node.arguments.length > 0) {
              const firstArgument = node.arguments[0];

              if (firstArgument.type === AST_NODE_TYPES.Literal) {
                const firstArgumentValue = firstArgument.value?.toString();

                if (firstArgumentValue?.startsWith(FORBIDEN_WORD)) {
                  context.report({
                    messageId: 'noShould',
                    loc: {
                      start: {
                        line: firstArgument.loc.start.line,
                        column: firstArgument.loc.start.column + 1,
                      },
                      end: {
                        line: firstArgument.loc.end.line,
                        column: firstArgument.loc.start.column + FORBIDEN_WORD.length + 1,
                      },
                    },
                    fix: (fixer: RuleFixer) => {
                      let textReplacement = firstArgumentValue;

                      Object.keys(SHOULD_REPLACEMENTS).forEach((from) => {
                        const to = SHOULD_REPLACEMENTS[from];
                        const fromRegex = new RegExp(`\\b${from}\\b`);
                        textReplacement = textReplacement.replace(fromRegex, to);
                      });

                      return fixer.replaceText(firstArgument, `'${textReplacement}'`);
                    },
                  });
                }
              }
            }
          }
        }
      },
    };
  },
});
