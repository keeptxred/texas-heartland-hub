export type ExploreErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'DUPLICATE_ENTITY'
  | 'RELATIONSHIP_CONFLICT'
  | 'IMPORT_ERROR'
  | 'PERMISSION_DENIED'
  | 'UNKNOWN_ERROR';

export class ExploreError extends Error {
  readonly code: ExploreErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      code?: ExploreErrorCode;
      status?: number;
      details?: Record<string, unknown>;
      cause?: unknown;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = new.target.name;
    this.code = options.code ?? 'UNKNOWN_ERROR';
    this.status = options.status ?? 500;
    this.details = options.details;
  }
}

export class ExploreValidationError extends ExploreError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { code: 'VALIDATION_ERROR', status: 400, details });
  }
}

export class ExploreNotFoundError extends ExploreError {
  constructor(resource: string, identifier?: string) {
    super(identifier ? `${resource} ${identifier} was not found.` : `${resource} was not found.`, {
      code: 'NOT_FOUND',
      status: 404,
      details: identifier ? { resource, identifier } : { resource },
    });
  }
}

export class ExploreDuplicateEntityError extends ExploreError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { code: 'DUPLICATE_ENTITY', status: 409, details });
  }
}

export class ExploreRelationshipConflictError extends ExploreError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { code: 'RELATIONSHIP_CONFLICT', status: 409, details });
  }
}

export class ExploreImportError extends ExploreError {
  constructor(message: string, details?: Record<string, unknown>, cause?: unknown) {
    super(message, { code: 'IMPORT_ERROR', status: 422, details, cause });
  }
}

export function toExploreError(error: unknown): ExploreError {
  if (error instanceof ExploreError) return error;
  if (error instanceof Error) {
    return new ExploreError(error.message, { cause: error });
  }
  return new ExploreError('An unknown Explore Texas error occurred.', {
    details: { value: error },
  });
}
