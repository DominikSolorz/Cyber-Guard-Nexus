import { Link, useLocation } from 'react-router-dom'
import {
  Shield,
  Activity,
  AlertTriangle,
  Bug,
  BarChart3,
} from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Security Scans', href: '/security', icon: Shield },
  { name: 'Vulnerabilities', href: '/vulnerabilities', icon: Bug },
  { name: 'Threat Detection', href: '/threats', icon: AlertTriangle },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex flex-col w-64 bg-gray-950 border-r border-gray-800">
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <Shield className="w-8 h-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold text-white">
          Cyber Guard
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
