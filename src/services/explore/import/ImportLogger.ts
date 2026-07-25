export interface ImportLogEntry {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  jobId?: string;
  sourceId?: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

export class ImportLogger {
  constructor(private readonly sink: (entry: ImportLogEntry) => void = console.log) {}

  debug(message: string, context?: Omit<ImportLogEntry, "level" | "message" | "timestamp">): void {
    this.write("debug", message, context);
  }

  info(message: string, context?: Omit<ImportLogEntry, "level" | "message" | "timestamp">): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: Omit<ImportLogEntry, "level" | "message" | "timestamp">): void {
    this.write("warn", message, context);
  }

  error(message: string, error: unknown, context?: Omit<ImportLogEntry, "level" | "message" | "timestamp">): void {
    this.write("error", message, {
      ...context,
      context: {
        ...context?.context,
        error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error),
      },
    });
  }

  private write(level: ImportLogEntry["level"], message: string, context?: Omit<ImportLogEntry, "level" | "message" | "timestamp">): void {
    this.sink({ level, message, timestamp: new Date().toISOString(), ...context });
  }
}
