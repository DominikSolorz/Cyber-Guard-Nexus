import { useQuery } from '@tanstack/react-query'
import { Shield, Bug, AlertTriangle, Activity } from 'lucide-react'
import { api } from '@/api/client'

export function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.get('/monitoring/metrics'),
  })

  const stats = [
    {
      name: 'Active Scans',
      value: '12',
      change: '+2.5%',
      icon: Shield,
      color: 'blue',
    },
    {
      name: 'Vulnerabilities',
      value: '47',
      change: '-8.1%',
      icon: Bug,
      color: 'yellow',
    },
    {
      name: 'Active Threats',
      value: '3',
      change: '+12%',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      name: 'System Health',
      value: '98%',
      change: '+0.5%',
      icon: Activity,
      color: 'green',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
        <p className="mt-2 text-gray-400">
          Overview of your security posture and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-green-400">{stat.change}</p>
                </div>
                <Icon className={`w-12 h-12 text-${stat.color}-500`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Threats
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Brute Force Attack
                    </p>
                    <p className="text-xs text-gray-400">192.168.1.100</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">5 min ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
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
              <div className="w-full bg-gray-900 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${metrics?.cpu_usage || 0}%`,
                  }}
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
              <div className="w-full bg-gray-900 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${metrics?.memory_usage || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
