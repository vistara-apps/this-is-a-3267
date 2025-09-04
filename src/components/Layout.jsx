import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  Timer, 
  BookOpen, 
  User, 
  Settings,
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  const { signOut } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Timer', href: '/timer', icon: Timer },
    { name: 'Journal', href: '/journal', icon: BookOpen },
  ]

  const isActive = (path) => location.pathname === path

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile Header */}
      <div className="lg:hidden bg-surface border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-accent" />
            <span className="text-lg font-bold">FastiFlow</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-bg/80 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-surface border-r border-border z-50 flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-accent" />
                  <span className="text-xl font-bold">FastiFlow</span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={closeMobileMenu}
                          className={
                            isActive(item.href)
                              ? 'nav-link-active'
                              : 'nav-link-inactive'
                          }
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Mobile User section */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => {
                    signOut()
                    closeMobileMenu()
                  }}
                  className="nav-link-inactive w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-surface border-r border-border flex-col min-h-screen">
          {/* Logo */}
          <div className="p-6 border-b border-border">
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
                      className={
                        isActive(item.href)
                          ? 'nav-link-active'
                          : 'nav-link-inactive'
                      }
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
          <div className="p-4 border-t border-border">
            <button
              onClick={signOut}
              className="nav-link-inactive w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-screen">
          <main className="container-app py-6 lg:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
        <nav className="flex">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                  active
                    ? 'text-accent bg-accent/10'
                    : 'text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="lg:hidden h-20" />
    </div>
  )
}
