const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
export async function checkHealth(database: boolean, signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(5000)
  const response = await fetch(`${baseUrl}/health${database ? '/db' : ''}`, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Health check failed: ${response.status}`)
  const data: unknown = await response.json()
  if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'ok' ||
    (database ? !('database' in data) || data.database !== 'connected' : !('service' in data) || data.service !== 'ARAH API')) {
    throw new Error('Unexpected health response')
  }
}
