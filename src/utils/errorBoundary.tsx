import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Something went wrong
            </h1>
            <p className="text-white/80 text-center mb-6">
              We apologize for the inconvenience. The application has encountered an error.
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="glass-button w-full py-3 rounded-lg justify-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              {process.env.NODE_ENV === 'development' && (
                <div className="glass-card p-4 text-sm">
                  <p className="text-white font-mono mb-2">
                    {this.state.error?.toString()}
                  </p>
                  <pre className="text-white/60 overflow-auto max-h-40">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}