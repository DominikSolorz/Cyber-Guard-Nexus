import { Bell, Search, User } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-gray-950 border-b border-gray-800">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for threats, vulnerabilities..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors">
          <User className="w-6 h-6" />
        </button>
      </div>
    </header>
  )
}
