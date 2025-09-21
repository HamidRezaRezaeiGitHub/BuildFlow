/**
 * Timer service for managing scheduled operations
 * 
 * This service encapsulates timer functionality to make it easily testable
 * and provides a clean interface for scheduling and managing timers.
 */

export interface TimerService {
  /**
   * Schedule a callback to run after a delay
   * @param callback Function to execute
   * @param delayMs Delay in milliseconds
   * @returns Timer ID that can be used to cancel the timer
   */
  schedule(callback: () => void | Promise<void>, delayMs: number): TimerId;
  
  /**
   * Cancel a scheduled timer
   * @param timerId Timer ID returned from schedule()
   */
  cancel(timerId: TimerId): void;
  
  /**
   * Cancel all scheduled timers
   */
  cancelAll(): void;
}

export type TimerId = string | number | NodeJS.Timeout;

/**
 * Default implementation using native setTimeout/clearTimeout
 */
class DefaultTimerService implements TimerService {
  private timers = new Set<TimerId>();

  schedule(callback: () => void | Promise<void>, delayMs: number): TimerId {
    const timerId = setTimeout(async () => {
      this.timers.delete(timerId);
      await callback();
    }, delayMs);
    
    this.timers.add(timerId);
    return timerId;
  }

  cancel(timerId: TimerId): void {
    clearTimeout(timerId as NodeJS.Timeout);
    this.timers.delete(timerId);
  }

  cancelAll(): void {
    this.timers.forEach(timerId => {
      clearTimeout(timerId as NodeJS.Timeout);
    });
    this.timers.clear();
  }
}

/**
 * Mock implementation for testing
 */
export class MockTimerService implements TimerService {
  private nextId = 1;
  private scheduledCallbacks = new Map<TimerId, { callback: () => void | Promise<void>; delayMs: number }>();

  schedule(callback: () => void | Promise<void>, delayMs: number): TimerId {
    const timerId = this.nextId++;
    this.scheduledCallbacks.set(timerId, { callback, delayMs });
    return timerId;
  }

  cancel(timerId: TimerId): void {
    this.scheduledCallbacks.delete(timerId);
  }

  cancelAll(): void {
    this.scheduledCallbacks.clear();
  }

  // Test utilities
  getScheduledCount(): number {
    return this.scheduledCallbacks.size;
  }

  getScheduledCallback(timerId: TimerId): { callback: () => void | Promise<void>; delayMs: number } | undefined {
    return this.scheduledCallbacks.get(timerId);
  }

  getAllScheduled(): Array<{ timerId: TimerId; callback: () => void | Promise<void>; delayMs: number }> {
    return Array.from(this.scheduledCallbacks.entries()).map(([timerId, data]) => ({
      timerId,
      ...data
    }));
  }

  async executeCallback(timerId: TimerId): Promise<void> {
    const scheduled = this.scheduledCallbacks.get(timerId);
    if (scheduled) {
      this.scheduledCallbacks.delete(timerId);
      await scheduled.callback();
    }
  }

  async executeAllCallbacks(): Promise<void> {
    const callbacks = Array.from(this.scheduledCallbacks.values());
    this.scheduledCallbacks.clear();
    
    for (const { callback } of callbacks) {
      await callback();
    }
  }
}

// Export singleton instance
export const timerService: TimerService = new DefaultTimerService();