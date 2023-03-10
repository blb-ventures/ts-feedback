export interface DefaultStrategyReturn {
  successMessage?: string;
  errorMessage?: string;
}

export interface Errors {
  server: string[];
  input: string[];
  errorMessage?: string;
}

export interface FeedbackStrategy<Context, Return = void> {
  validateResponse: <T>(response: T, ctx: Context) => boolean | Promise<boolean>;
  successHandler: <T>(response: T, ctx: Context) => Return | Promise<Return>;
  errorHandler: <T>(response: T, error: unknown, ctx: Context) => Return | Promise<Return>;
  completeHandler?: <T>(response: T, ctx: Context) => void | Promise<void>;
}

export interface FeedbackReporter {
  success: (message: string) => void;
  error: (message: string) => void;
}
