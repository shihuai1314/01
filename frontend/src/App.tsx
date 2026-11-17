import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string
  service: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json() as Promise<HealthResponse>
      })
      .then(setHealth)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : '未知错误')
        }
      })

    return () => controller.abort()
  }, [])

  const connected = health?.status === 'UP'

  return (
    <main className="app-shell">
      <section className="status-card">
        <p className="eyebrow">TAXI AGENT</p>
        <h1>网约车智能调度系统</h1>
        <p className="description">React 与 Spring Boot 全栈开发环境检查</p>

        <div className={`status ${connected ? 'online' : error ? 'offline' : ''}`}>
          <span className="status-dot" />
          {connected && '前后端连接成功'}
          {error && `后端连接失败：${error}`}
          {!connected && !error && '正在连接后端...'}
        </div>

        {health && (
          <dl className="service-info">
            <div>
              <dt>服务</dt>
              <dd>{health.service}</dd>
            </div>
            <div>
              <dt>状态</dt>
              <dd>{health.status}</dd>
            </div>
          </dl>
        )}
      </section>
    </main>
  )
}

export default App
