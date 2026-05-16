type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private static instance: Logger;
  private isProd = process.env.NODE_ENV === "production";

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${
      context ? JSON.stringify(context) : ""
    }`;
  }

  info(message: string, context?: any) {
    console.log(this.formatMessage("info", message, context));
    // Here you could send to Axiom or Sentry if in production
  }

  warn(message: string, context?: any) {
    console.warn(this.formatMessage("warn", message, context));
  }

  error(message: string, context?: any) {
    console.error(this.formatMessage("error", message, context));
    
    if (this.isProd) {
      // Sentry.captureException(err) or similar
    }
  }

  debug(message: string, context?: any) {
    if (!this.isProd) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }
}

export const logger = Logger.getInstance();
