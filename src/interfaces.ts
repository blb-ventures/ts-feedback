export interface DefaultReturn {
  successMessage?: string;
  errorMessage?: string;
}

export interface DefaultContext<ResponseType> {
  successCondition?: (response: ResponseType) => boolean;
  successMessage?: string | ((response: ResponseType) => string);
  errorMessage?: string;
  onError?: (error: unknown) => void;
  onSuccess?: (response: ResponseType) => void;
  onComplete?: (response: ResponseType | null) => void;
}

export interface Errors {
  server: string[];
  input: string[];
  errorMessage?: string;
}

export interface FeedbackStrategy<Return = void> {
  validateResponse: <T>(response: T, ctx: DefaultContext<T>) => boolean | Promise<boolean>;
  successHandler: <T>(response: T, ctx: DefaultContext<T>) => Return | Promise<Return>;
  errorHandler: <T>(
    response: T | null,
    error: unknown,
    ctx: DefaultContext<T>,
  ) => Return | Promise<Return>;
  completeHandler?: <T>(response: T | null, ctx: DefaultContext<T>) => void | Promise<void>;
}

export interface FeedbackReporter {
  success: (message: string) => void;
  error: (message: string) => void;
}
