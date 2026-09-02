import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    try {
      const body = JSON.stringify({
        type: "react-error-boundary",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        info: errorInfo,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        ts: Date.now(),
      });
      if (navigator?.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/log', blob);
      }
      // Also log to console for visibility during development
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught an error", error, errorInfo);
    } catch {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-6 m-4 rounded-xl bg-red-50 text-red-800 border border-red-200">
          <h2 className="font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
