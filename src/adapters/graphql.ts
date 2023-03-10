/* eslint-disable @typescript-eslint/brace-style */
import { ApolloError, FetchResult } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { CombinedError, OperationResult } from 'urql';
import { DefaultStrategyReturn, FeedbackStrategy } from '../interfaces';

export type DefaultData = Record<string, any>;
export type DefaultResponse = OperationResult<DefaultData> | FetchResult<DefaultData>;

export interface GraphQLStrategyContext {
  successCondition?: <T>(response: T) => boolean;
  successMessage?: string | (<T>(response: T) => string);
  errorMessage?: string;
  onError?: (error: unknown) => void;
  onSuccess?: <T>(response: T) => void;
  onComplete?: <T>(response: T | null) => void;
}

export interface GraphQLStrategyReturn extends DefaultStrategyReturn {
  hasErrors: boolean;
  serverErrors?: string[];
}

export interface GraphQLStrategyDefaultMessages {
  defaultMessage: string;
  networkError: string;
}

export class GraphQLStrategy
  implements FeedbackStrategy<GraphQLStrategyContext, GraphQLStrategyReturn>
{
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
    ctx: GraphQLStrategyContext,
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
    response: ResponseType,
    error: unknown,
    ctx: GraphQLStrategyContext,
  ): GraphQLStrategyReturn => {
    ctx.onError?.(error);
    const serverErrors = isUrqlResponse(response) ? this.getErrorServerErrors(response.error) : [];
    if (error instanceof ApolloError) {
      serverErrors.push(...this.getErrorServerErrors(error));
    }
    if (error instanceof CombinedError) {
      serverErrors.push(...this.getErrorServerErrors(error));
    }
    let errorMessage = ctx.errorMessage ?? this.errorMessages.defaultMessage;
    if (
      (error instanceof CombinedError || error instanceof ApolloError) &&
      error.networkError != null
    ) {
      errorMessage = this.errorMessages.networkError;
    }
    return { serverErrors, errorMessage, hasErrors: true };
  };

  /* eslint-disable-next-line class-methods-use-this */
  completeHandler = <ResponseType>(response: ResponseType, ctx: GraphQLStrategyContext) => {
    ctx.onComplete?.(response);
  };

  /* eslint-disable-next-line class-methods-use-this */
  validateResponse = <ResponseType>(response: ResponseType, ctx: GraphQLStrategyContext) => {
    if (ctx.successCondition != null) return ctx.successCondition(response);
    if (isDefaultResponse(response)) {
      return response.data != null && (!('error' in response) || response.error != null);
    }
    return false;
  };

  /* eslint-disable-next-line class-methods-use-this */
  getErrorServerErrors(error: ApolloError | CombinedError | null | undefined) {
    if (error != null) {
      if (error.graphQLErrors.length > 0) {
        return (error.graphQLErrors as GraphQLError[]).map(it => it.message);
      }
      return [error.message];
    }
    return [] as string[];
  }
}

const isDefaultResponse = (value: unknown): value is DefaultResponse =>
  value != null && typeof value === 'object' && 'data' in value;

const isUrqlResponse = (value: unknown): value is OperationResult<DefaultData> =>
  isDefaultResponse(value) && 'error' in value;
