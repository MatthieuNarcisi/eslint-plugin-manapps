# Disallow the usage of the store object in components (`no-store-in-components`)

## Rule Details

Enforce the Facade pattern and disallow the direct use of the store object in the components.

Examples of **incorrect** code for this rule:

```ts
class TestComponent { constructor(store: Store) {} }
```

```ts
class TestComponent { constructor(private store: Store) {} }
```

```ts
class TestComponent { constructor(container: Store) {} }
```

```ts
class TestComponent { constructor(private container: Store) {} }
```

Examples of **correct** code for this rule:

```ts
class TestService { constructor(store: Store) {} }
```

```ts
class TestComponent { constructor(anotherService: AnotherService) {} }
```

## When Not To Use It

If you do not yet have implemented the facade pattern in your application.
