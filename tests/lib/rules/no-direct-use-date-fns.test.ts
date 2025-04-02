/**
 * @fileoverview Prevent direct usage of date-fns except in helper files (*.helper.ts).
 * @author Massil TAGUEMOUT
 */
'use strict';

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/no-direct-use-date-fns';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run('no-direct-use-date-fns', rule, {
  valid: [
    {
      code: `
        import { formatDate } from 'utils/dateHelper';
      `,
      filename: 'example.ts',
    },
    {
      code: `
        import moment from 'moment';
      `,
      filename: 'example.ts',
    },
    {
      code: `
        import { format } from 'date-fns';
      `,
      filename: 'utils/date.helper.ts',
    },
    {
      code: `
        const dateFns = import('date-fns');
      `,
      filename: 'utils/date.helper.ts',
    },
  ],

  invalid: [
    {
      code: `
        import { format } from 'date-fns';
      `,
      filename: 'services/user.service.ts',
      errors: [{ messageId: 'noDirectUseDateFns' }],
    },
    {
      code: `
        import * as dateFns from 'date-fns';
      `,
      filename: 'components/DatePicker.ts',
      errors: [{ messageId: 'noDirectUseDateFns' }],
    },
    {
      code: `
        const dateFns = import('date-fns');
      `,
      filename: 'utils/dateUtil.ts',
      errors: [{ messageId: 'noDirectUseDateFns' }],
    },
  ],
});
