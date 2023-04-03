/* eslint-disable @typescript-eslint/brace-style */
import { ExecutionResult } from 'graphql';
import { DefaultContext, FeedbackStrategy } from '../interfaces';
import {
  GraphQLStrategy,
  GraphQLStrategyDefaultMessages,
  GraphQLStrategyReturn,
  UrqlLikeResult,
} from './graphql';

/** The kind of the returned message. */
export enum OperationMessageKind {
  Error = 'ERROR',
  Info = 'INFO',
  Permission = 'PERMISSION',
  Validation = 'VALIDATION',
  Warning = 'WARNING',
}

/** Multiple messages returned by an operation. */
export interface OperationInfo {
  /** List of messages returned by the operation. */
  messages: OperationMessage[];
}

/** An error that happened while executing an operation. */
export interface OperationMessage {
  /** The field that caused the error, or `null` if it isn't associated with any particular field */
  field?: string | null;
  /** The kind of this message. */
  kind: OperationMessageKind;
  /** The error message. */
  message: string;
}

export type DataOrOperationInfo<Typename extends string> =
  | {
      __typename?: Typename;
      [key: string]: any;
    }
  | { __typename: 'OperationInfo'; messages: OperationInfo['messages'] };

export type DefaultDataWithOperationInfo<Typename extends string> = Record<
  string,
  DataOrOperationInfo<Typename> | null
>;

export type DefaultResponseWithOperationInfo<Typename extends string = string> =
  | ExecutionResult<DefaultDataWithOperationInfo<Typename>>
  | UrqlLikeResult<DefaultDataWithOperationInfo<Typename>>;

export interface GraphQLWithOperationInfoStrategyReturn extends GraphQLStrategyReturn {
  clientErrors?: string[];
}

export class GraphQLWithOperationInfoStrategy
  implements FeedbackStrategy<GraphQLWithOperationInfoStrategyReturn>
{
  graphQLStrategy: GraphQLStrategy;

  constructor(errorMessages?: Partial<GraphQLStrategyDefaultMessages>) {
    this.graphQLStrategy = new GraphQLStrategy(errorMessages);
  }

  successHandler = <ResponseType>(
    response: ResponseType,
    ctx: DefaultContext<ResponseType>,
  ): GraphQLWithOperationInfoStrategyReturn => {
    const res = this.graphQLStrategy.successHandler(response, ctx);
    const clientErrors = isDefaultResponse<string>(response)
      ? this.getResponseInputErrors(response.data)
      : [];
    return {
      ...res,
      clientErrors,
      hasErrors: clientErrors.length > 0,
      errorMessage: clientErrors.join('\n'),
    };
  };

  errorHandler = <ResponseType>(
    response: ResponseType | null,
    error: unknown,
    ctx: DefaultContext<ResponseType>,
  ): GraphQLWithOperationInfoStrategyReturn => {
    const res = this.graphQLStrategy.errorHandler(response, error, ctx);
    const clientErrors = isDefaultResponse<string>(response)
      ? this.getResponseInputErrors(response.data)
      : [];
    return { ...res, clientErrors };
  };

  validateResponse = <ResponseType>(response: ResponseType, ctx: DefaultContext<ResponseType>) => {
    const res = this.graphQLStrategy.validateResponse(response, ctx);
    if (!res) return res;
    const clientErrors = isDefaultResponse<string>(response)
      ? this.getResponseInputErrors(response.data)
      : [];
    return clientErrors.length <= 0;
  };

  /* eslint-disable-next-line class-methods-use-this */
  completeHandler = <ResponseType>(
    response: ResponseType | null,
    ctx: DefaultContext<ResponseType>,
  ) => {
    ctx.onComplete?.(response);
  };

  /* eslint-disable-next-line class-methods-use-this */
  getResponseInputErrors(data: DefaultDataWithOperationInfo<string> | null | undefined) {
    if (data == null) return [];
    return Object.keys(data)
      .reduce<OperationInfo[]>(
        (acc, it) =>
          data[it]?.__typename === 'OperationInfo' ? acc.concat(data[it] as OperationInfo) : acc,
        [],
      )
      .flatMap(op => op.messages.map(it => it.message));
  }
}

const isDefaultResponse = <T extends string>(
  value: unknown,
): value is DefaultResponseWithOperationInfo<T> =>
  value != null && typeof value === 'object' && 'data' in value;
