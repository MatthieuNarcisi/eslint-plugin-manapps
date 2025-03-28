/**
 * @fileoverview Prevent subscribing to observables in tests. Use firstValueFrom and return expect(...).resolves.to... instead.
 * @author Massil TAGUEMOUT
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../../lib/rules/no-subscribe-in-tests';

const ruleTester = new RuleTester();

ruleTester.run('no-subscribe-in-tests', rule, {
  valid: [
    {
      code: `
        import { of, firstValueFrom } from 'rxjs';
        
        const myObservable = of(1, 2, 3);
        async function testFunction() {
          const result = await firstValueFrom(myObservable);
          return expect(result).resolves.toBeDefined();
        }
      `,
      filename: 'example.spec.ts',
    },
    {
      code: `
        import { fromEvent } from 'rxjs';

        const clicks = fromEvent(document, 'click');
        async function testFunction() {
          const result = await firstValueFrom(clicks);
          return expect(result).resolves.toBeDefined();
        }
      `,
      filename: 'example.test.ts',
    },
    {
      code: `
        import { of, firstValueFrom } from 'rxjs';
      
        function notAnObservable() {
          return { subscribe: () => {} };
        }

        const obj = notAnObservable();
        obj.subscribe(); // Will not trigger the rule
      `,
      filename: 'example.spec.ts',
    },
  ],

  invalid: [
    {
      code: `
        import { of } from 'rxjs';

        const myObservable = of(1, 2, 3);
        myObservable.subscribe((val) => console.log(val));
      `,
      filename: 'example.spec.ts',
      errors: [{ messageId: 'noSubscribeInTests' }],
    },
    {
      code: `
        import { Observable } from 'rxjs';

        const myObservable = new Observable(subscriber => {
          subscriber.next(1);
          subscriber.complete();
        });

        myObservable.subscribe();
      `,
      filename: 'example.test.ts',
      errors: [{ messageId: 'noSubscribeInTests' }],
    },
    {
      code: `
        import { fromEvent } from 'rxjs';

        const clicks = fromEvent(document, 'click');
        clicks.subscribe();
      `,
      filename: 'example.spec.ts',
      errors: [{ messageId: 'noSubscribeInTests' }],
    },
    {
      code: `
        import { merge, of } from 'rxjs';

        const merged = merge(of(1), of(2));
        merged.subscribe(console.log);
      `,
      filename: 'example.test.ts',
      errors: [{ messageId: 'noSubscribeInTests' }],
    },
  ],
});
