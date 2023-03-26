# TS-Feedback

A library to help build common responses to certain actions

## Installation

```sh
npm install @blb-ventures/ts-feedback       # npm
yarn add @blb-ventures/ts-feedback          # yarn
bun add @blb-ventures/ts-feedback           # bun
pnpm add @blb-ventures/ts-feedback          # pnpm
```

## Quickstart

### Usage with existing adapters

```ts
// graphql-call.ts
import { GraphQLStrategy, createFeedback } from '@blb-ventures/ts-feedback';

export const graphqlCall = createFeedback({
  strategy: new GraphQLStrategy({
    defaultMessage: 'Unexpected error',
    networkError: 'Network Error. Check your internat connection and try again.',
  }),
  reporter: {
    error: message => console.log(message),
    success: message => console.log(message),
  },
});

// pages/users.tsx
const { hasErrors } = await graphqlCall(() => removeUser({ email }), {
  errorMessage: 'Erro while trying to remove user',
});
if (!hasErrors) startupUsersRefetch();
```

### Usage with your own adapter

```ts
// api-call.ts
class MyApiStrategy implements FeedbackStrategy<MyAPICommonResponse> {
  // ...
}

export const graphqlCall = createFeedback({
  strategy: new MyApiStrategy(),
  reporter: {
    error: message => console.log(message),
    success: message => console.log(message),
  },
});

// or

const myStrategy = {
  validateResponse: <T>(response: T, ctx: DefaultContext<T>): boolean | Promise<boolean> {};
  successHandler: <T>(response: T, ctx: DefaultContext<T>): Return | Promise<Return> {};
  errorHandler: <T>(
    response: T | null,
    error: unknown,
    ctx: DefaultContext<T>,
  ): Return | Promise<Return> {};
  completeHandler?: <T>(response: T | null, ctx: DefaultContext<T>): void | Promise<void> {};
}

export const graphqlCall = createFeedback({
  strategy: myStrategy,
  reporter: {
    error: message => console.log(message),
    success: message => console.log(message),
  },
});

```

## Concept / How it works

The idea behind this library is to make it easier to reuse logic when dealing with functions that have the same format.
Right now we are using it to handle GraphQL API responses that have the same interface across some frontend clients.

## Adapters

### GraphQL

It expects the spec response for `ExecutionResult` and can deal with server errors from `@apollo/client` and `urql` clients requests.

### GraphQL with OperationInfo

Same as the GraphQL adapter, but it also detects a response error when the return format contains a `OperationInfo` type object.
This format is defined throughout most of BLB Ventures projects and it is a object that is returned instead of the desired response object (We usually declare Mutation responses as a Union of the desired object and the `OperationInfo` error response).
This kind of response only occurs when there is some kind malformed input or other validation errors when requesting a Mutation.
