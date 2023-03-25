/* eslint-disable @typescript-eslint/brace-style */
import { ExecutionResult, GraphQLError } from 'graphql';
import { DefaultContext, DefaultReturn, FeedbackStrategy } from '../interfaces';

export interface GraphqlClientError extends Error {
  message: string;
  graphQLErrors?: GraphQLError[];
  networkError?: Error;
}

export interface UrqlLikeResult<TData = Record<string, any>> {
  data?: TData | null;
  error?: GraphqlClientError | null;
}

export type DefaultData = Record<string, any>;
export type DefaultResponse = ExecutionResult<DefaultData> | UrqlLikeResult<DefaultData>;

export interface GraphQLStrategyReturn extends DefaultReturn {
  hasErrors: boolean;
  serverErrors?: string[];
}

export interface GraphQLStrategyDefaultMessages {
  defaultMessage: string;
  networkError: string;
}

export class GraphQLStrategy implements FeedbackStrategy<GraphQLStrategyReturn> {
  errorMessages: GraphQLStrategyDefaultMessages;

  constructor(errorMessages?: Partial<GraphQLStrategyDefaultMessages>) {
    this.errorMessages = {
      defaultMessage: errorMessages?.defaultMessage ?? 'Unexpected error',
      networkError: errorMessages?.networkError ?? 'Network error, check your internet connection',
    };
  }

  /* eslint-disable-next-line class-methods-use-this */
  public successHandler = <ResponseType>(
    response: ResponseType,
    ctx: DefaultContext<ResponseType>,
  ): GraphQLStrategyReturn => {
    ctx.onSuccess?.(response);
    return {
      hasErrors: false,
      successMessage:
        typeof ctx.successMessage === 'string'
          ? ctx.successMessage
          : ctx.successMessage?.(response),
    };
  };

  errorHandler = <ResponseType>(
    response: ResponseType | null,
    error: unknown,
    ctx: DefaultContext<ResponseType>,
  ): GraphQLStrategyReturn => {
    ctx.onError?.(error);
    const serverErrors = isUrqlLikeResponse(response)
      ? this.getErrorServerErrors(response.error)
      : [];
    if (isGraphQLClientError(error)) serverErrors.push(...this.getErrorServerErrors(error));
    let errorMessage = ctx.errorMessage ?? this.errorMessages.defaultMessage;
    if (isGraphQLClientError(error) && error.networkError != null) {
      errorMessage = this.errorMessages.networkError;
    }
    return { serverErrors, errorMessage, hasErrors: true };
  };

  /* eslint-disable-next-line class-methods-use-this */
  completeHandler = <ResponseType>(
    response: ResponseType | null,
    ctx: DefaultContext<ResponseType>,
  ) => {
    ctx.onComplete?.(response);
  };

  /* eslint-disable-next-line class-methods-use-this */
  validateResponse = <ResponseType>(response: ResponseType, ctx: DefaultContext<ResponseType>) => {
    if (ctx.successCondition != null) return ctx.successCondition(response);
    if (isDefaultResponse(response)) {
      return response.data != null && (!('error' in response) || response.error != null);
    }
    return false;
  };

  /* eslint-disable-next-line class-methods-use-this */
  getErrorServerErrors(error: GraphqlClientError | null | undefined): string[] {
    if (error == null) return [];
    if ((error.graphQLErrors ?? []).length > 0) {
      return (error.graphQLErrors as GraphQLError[]).map(it => it.message);
    }
    return [error.message];
  }
}

const isDefaultResponse = (value: unknown): value is DefaultResponse =>
  value != null && typeof value === 'object' && 'data' in value;

const isUrqlLikeResponse = (value: unknown): value is UrqlLikeResult<DefaultData> =>
  isDefaultResponse(value) && 'error' in value;

const isGraphQLClientError = (error: unknown): error is GraphqlClientError =>
  error instanceof Error && 'graphQLErrors' in error;
