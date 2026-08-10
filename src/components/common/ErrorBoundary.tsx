import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ServerErrorPage } from '../../pages/error/ServerErrorPage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React UI error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const details = this.state.error
        ? `${this.state.error.toString()}\n${this.state.errorInfo?.componentStack || ''}`
        : 'An unexpected application rendering error occurred.';

      return <ServerErrorPage errorDetails={details} />;
    }

    return this.props.children;
  }
}
