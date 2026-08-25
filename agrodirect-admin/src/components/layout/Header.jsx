import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header({ onMenuClick, title }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b border-soil-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-soil-600 hover:bg-soil-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-soil-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-soil-800">{user?.name}</p>
          <p className="text-xs text-soil-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-soil-600 hover:bg-soil-100"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  )
}
