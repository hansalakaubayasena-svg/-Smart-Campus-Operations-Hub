import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
              Frontend Error
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              The app hit a runtime error
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              The exact browser error is shown below so we can fix it quickly.
            </p>
            <pre className="mt-6 overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-rose-200">
              {String(this.state.error?.message || this.state.error || "Unknown error")}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
