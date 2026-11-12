import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0F4C2A] mb-1">
              Portal Restored
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              The portal encountered a transient connection issue. Click below to continue smoothly.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 bg-[#28AF60] hover:bg-[#229652] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Continue to Examination</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
