import { GraphQLWithOperationInfoStrategy } from './adapters/graphql-operation-info';
import { createFeedback } from './feedback';

export const graphqlFeedback = createFeedback({
  strategy: new GraphQLWithOperationInfoStrategy(),
  reporter: {
    error: message => console.log(message),
    success: message => console.log(message),
  },
});

const example = async () => {
  const res = await graphqlFeedback(async () => ({ data: { test: { id: '1' } } }), {
    successMessage: 'Success',
  });
  console.log(res.response?.data.test.id);
};

example();
