import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full my-6 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 backdrop-blur-md shadow-2xl text-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {this.props.fallbackTitle || 'A rendering issue occurred in this view'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The analytical engine caught an unexpected data shape. Other dashboard tabs remain functional.
                </p>
              </div>
            </div>

            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </button>
          </div>

          {this.state.error && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={this.toggleDetails}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-300 font-medium transition-colors"
              >
                <span>{this.state.showDetails ? 'Hide error details' : 'Show technical error details'}</span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-rose-300/90 overflow-x-auto whitespace-pre-wrap">
                  <div className="font-semibold text-rose-400 mb-1">{this.state.error.toString()}</div>
                  {this.state.errorInfo?.componentStack}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
