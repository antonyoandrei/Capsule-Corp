import { Component, type ReactNode } from "react"

class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="route-error" role="alert">
        <h1>This page could not load</h1>
        <p>Check your connection and reload the page.</p>
        <button className="store-button store-button--text" onClick={() => window.location.reload()}>Reload page</button>
      </section>
    )
  }
}

export default RouteBoundary
