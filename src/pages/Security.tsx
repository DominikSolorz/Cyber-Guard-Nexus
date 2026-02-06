import { useQuery } from '@tanstack/react-query'
import { Shield, Play } from 'lucide-react'
import { api } from '@/api/client'

export function Security() {
  const { data: scans } = useQuery({
    queryKey: ['scans'],
    queryFn: () => api.get('/security/scans'),
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Scans</h1>
          <p className="mt-2 text-gray-400">
            Manage and monitor your security scans
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Play className="w-4 h-4 mr-2" />
          New Scan
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Findings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {scans?.map((scan: any) => (
              <tr key={scan.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {scan.target}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {scan.scan_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      scan.status === 'completed'
                        ? 'bg-green-900 text-green-400'
                        : 'bg-yellow-900 text-yellow-400'
                    }`}
                  >
                    {scan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {scan.findings}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(scan.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
