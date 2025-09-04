import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  Timer, 
  BookOpen, 
  User, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react'

export default function Layout({ children }) {
  const { signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Timer', href: '/timer', icon: Timer },
    { name: 'Journal', href: '/journal', icon: BookOpen },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold">FastiFlow</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={signOut}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}