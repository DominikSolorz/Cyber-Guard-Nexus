import { useQuery } from '@tanstack/react-query'
import { Bug } from 'lucide-react'
import { api } from '@/api/client'

export function Vulnerabilities() {
  const { data: vulnerabilities } = useQuery({
    queryKey: ['vulnerabilities'],
    queryFn: () => api.get('/vulnerabilities'),
  })

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-900 text-red-400',
      high: 'bg-orange-900 text-orange-400',
      medium: 'bg-yellow-900 text-yellow-400',
      low: 'bg-green-900 text-green-400',
    }
    return colors[severity] || 'bg-gray-900 text-gray-400'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Vulnerabilities</h1>
        <p className="mt-2 text-gray-400">
          Identified security vulnerabilities across your systems
        </p>
      </div>

      <div className="grid gap-4">
        {vulnerabilities?.map((vuln: any) => (
          <div
            key={vuln.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Bug className="w-6 h-6 text-red-500 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {vuln.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {vuln.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">CVE ID:</span>
                      <span className="text-white font-mono">
                        {vuln.cve_id}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">Affected System:</span>
                      <span className="text-white">{vuln.affected_system}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">Remediation:</span>
                      <span className="text-white">{vuln.remediation}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                  vuln.severity
                )}`}
              >
                {vuln.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
