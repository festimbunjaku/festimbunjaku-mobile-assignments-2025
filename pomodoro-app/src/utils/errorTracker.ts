/**
 * Error Tracking Service
 * 
 * Provides a centralized error tracking system that can be extended
 * to integrate with services like Sentry, Bugsnag, or other error tracking tools.
 * 
 * Currently logs to console, but can be easily extended to send errors
 * to external services in production.
 */

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  screen?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

class ErrorTracker {
  private isInitialized = false;
  private enabled = true;

  /**
   * Initialize error tracking service
   * Can be extended to initialize Sentry, Bugsnag, etc.
   */
  init(options?: { enabled?: boolean; dsn?: string }): void {
    this.enabled = options?.enabled ?? true;
    this.isInitialized = true;

    // TODO: Initialize external error tracking service here
    // Example for Sentry:
    // if (options?.dsn) {
    //   Sentry.init({ dsn: options.dsn });
    // }
  }

  /**
   * Capture and log an error
   */
  captureError(
    error: Error | unknown,
    context?: ErrorContext
  ): void {
    if (!this.enabled) return;

    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Log to console (always available)
    console.error("ErrorTracker:", {
      message: errorObj.message,
      stack: errorObj.stack,
      context,
    });

    // TODO: Send to external error tracking service
    // Example for Sentry:
    // Sentry.captureException(errorObj, {
    //   tags: context,
    //   extra: context?.metadata,
    // });
  }

  /**
   * Capture a message (non-error)
   */
  captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info",
    context?: ErrorContext
  ): void {
    if (!this.enabled) return;

    console[level === "error" ? "error" : level === "warning" ? "warn" : "log"](
      "ErrorTracker:",
      message,
      context
    );

    // TODO: Send to external error tracking service
    // Example for Sentry:
    // Sentry.captureMessage(message, level, { extra: context });
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, email?: string): void {
    if (!this.enabled) return;

    // TODO: Set user context in external service
    // Example for Sentry:
    // Sentry.setUser({ id: userId, email });
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (!this.enabled) return;

    // TODO: Clear user context in external service
    // Example for Sentry:
    // Sentry.setUser(null);
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(
    message: string,
    category?: string,
    level?: "info" | "warning" | "error",
    data?: Record<string, unknown>
  ): void {
    if (!this.enabled) return;

    // TODO: Add breadcrumb to external service
    // Example for Sentry:
    // Sentry.addBreadcrumb({
    //   message,
    //   category,
    //   level,
    //   data,
    // });
  }

  /**
   * Enable/disable error tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if error tracking is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

// Export types
export type { ErrorContext };

