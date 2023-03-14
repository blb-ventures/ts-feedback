import { GraphQLStrategy } from './adapters';
import { createFeedback } from './feedback';

export const graphqlFeedback = createFeedback({
  strategy: new GraphQLStrategy(),
  reporter: {
    error: message => console.log(message),
    success: message => console.log(message),
  },
});

const example = async () => {
  const res = await graphqlFeedback(async () => ({ data: { test: { id: '1' } } }), {
    successMessage: 'Success',
    onSuccess: res => res.data.test.id,
  });
  console.log(res.response?.data.test.id);
};

example();
