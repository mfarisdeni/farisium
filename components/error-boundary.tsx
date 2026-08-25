'use client'

import { Component } from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[240px] items-center justify-center p-8">
          <div className="text-center">
            <p className="text-zinc-400 mb-2">Terjadi kesalahan</p>
            <p className="text-zinc-500 text-sm mb-4">
              {this.state.error?.message ?? 'Something went wrong'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
