/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import { FEEDBACK_KIND } from './constants';
import { DefaultStrategyReturn, FeedbackReporter, FeedbackStrategy } from './interfaces';

export type FeedbackKind = keyof typeof FEEDBACK_KIND;

export interface FeedbackReturn<T> {
  response: T | null;
  type: FeedbackKind;
}

const isPromise = <T>(value: unknown): value is Promise<T> =>
  value != null && typeof value === 'object' && 'then' in value && typeof value.then === 'function';

const getAwaitedResponse = async <T>(fn: () => T | Promise<T>) => {
  const resOrPromise = fn();
  if (isPromise(resOrPromise)) {
    const res = await resOrPromise;
    return res;
  }
  return resOrPromise;
};

export const createFeedback = <StrategyContext, StrategyReturn extends DefaultStrategyReturn>({
  strategy,
  reporter,
}: {
  strategy: FeedbackStrategy<StrategyContext, StrategyReturn>;
  reporter?: FeedbackReporter;
}) => {
  return async <FnReturnData>(
    fn: () => FnReturnData | Promise<FnReturnData>,
    ctx: StrategyContext,
  ): Promise<FeedbackReturn<FnReturnData> & StrategyReturn> => {
    let response: FnReturnData | null = null;
    let type: FeedbackKind = FEEDBACK_KIND.SUCCESS;
    let strategyReturn: StrategyReturn | null = null;
    try {
      response = await getAwaitedResponse(fn);
      if (response == null) throw new Error();
      const valid = await getAwaitedResponse(() => strategy.validateResponse(response, ctx));
      if (!valid) throw new Error();
      strategyReturn = await getAwaitedResponse(() => strategy.successHandler(response, ctx));
      if (reporter?.success && strategyReturn.successMessage != null) {
        reporter.success(strategyReturn.successMessage);
      }
    } catch (e) {
      type = FEEDBACK_KIND.ERROR;
      strategyReturn = await getAwaitedResponse(() => strategy.errorHandler(response, e, ctx));
      if (reporter?.error && strategyReturn.errorMessage != null) {
        reporter.error(strategyReturn.errorMessage);
      }
    } finally {
      strategy.completeHandler?.(response, ctx);
    }
    return { response, type, ...strategyReturn };
  };
};
