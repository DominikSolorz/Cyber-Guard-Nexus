import { useQuery } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { api } from '@/api/client'

export function Threats() {
  const { data: threats } = useQuery({
    queryKey: ['threats'],
    queryFn: () => api.get('/threats'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Threat Detection</h1>
        <p className="mt-2 text-gray-400">
          Real-time threat monitoring and analysis
        </p>
      </div>

      <div className="grid gap-4">
        {threats?.map((threat: any) => (
          <div
            key={threat.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {threat.type.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {threat.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Source IP:</span>
                      <span className="ml-2 text-white font-mono">
                        {threat.source_ip}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Target:</span>
                      <span className="ml-2 text-white font-mono">
                        {threat.target}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Detected:</span>
                      <span className="ml-2 text-white">
                        {new Date(threat.detected_at).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 text-white capitalize">
                        {threat.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  threat.severity === 'high'
                    ? 'bg-red-900 text-red-400'
                    : 'bg-orange-900 text-orange-400'
                }`}
              >
                {threat.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
