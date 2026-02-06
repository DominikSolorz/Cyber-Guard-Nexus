import { useQuery } from '@tanstack/react-query'
import { Activity } from 'lucide-react'
import { api } from '@/api/client'

export function Monitoring() {
  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.get('/monitoring/metrics'),
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.get('/monitoring/events'),
    refetchInterval: 3000,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Real-time Monitoring</h1>
        <p className="mt-2 text-gray-400">
          Live system metrics and security events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            System Metrics
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-white">
                  {metrics?.cpu_usage?.toFixed(1) || '0'}%
                </span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${metrics?.cpu_usage || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-white">
                  {metrics?.memory_usage?.toFixed(1) || '0'}%
                </span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${metrics?.memory_usage || 0}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400">Network In</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {metrics?.network_traffic?.incoming?.toFixed(1) || '0'} MB/s
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400">Network Out</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {metrics?.network_traffic?.outgoing?.toFixed(1) || '0'} MB/s
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Events
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events?.map((event: any) => (
              <div
                key={event.id}
                className="p-3 bg-gray-900 rounded-lg border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium uppercase ${
                      event.severity === 'warning'
                        ? 'text-yellow-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {event.event_type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-white">{event.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
