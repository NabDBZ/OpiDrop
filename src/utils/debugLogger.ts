type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDebugMode: boolean = process.env.NODE_ENV === 'development';

  constructor() {
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private handleGlobalError = (event: ErrorEvent) => {
    this.error('Uncaught error:', {
      message: event.message,
      filename: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      error: event.error
    });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.error('Unhandled promise rejection:', {
      reason: event.reason
    });
  };

  private addLog(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.isDebugMode) {
      console[level](
        `[${entry.timestamp}] ${message}`,
        data ? data : ''
      );
    }
  }

  public debug(message: string, data?: any) {
    this.addLog('debug', message, data);
  }

  public info(message: string, data?: any) {
    this.addLog('info', message, data);
  }

  public warn(message: string, data?: any) {
    this.addLog('warn', message, data);
  }

  public error(message: string, data?: any) {
    this.addLog('error', message, data);
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    return level 
      ? this.logs.filter(log => log.level === level)
      : this.logs;
  }

  public clearLogs() {
    this.logs = [];
  }

  public downloadLogs() {
    const logData = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optidrop-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const debugLogger = new DebugLogger();