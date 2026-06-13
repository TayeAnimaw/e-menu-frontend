import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfileMenu({ user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initial = (user?.cafe_name || user?.name || 'E')[0].toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-ink-100"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" className="h-9 w-9 rounded-full object-cover ring-1 ring-ink-100" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-sm font-semibold text-brand-700">
            {initial}
          </div>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-ink-400 transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl bg-white py-1.5 shadow-lg ring-1 ring-ink-100">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink-900">{user?.name}</p>
            <p className="truncate text-xs text-ink-500">{user?.cafe_name}</p>
          </div>
          <Link
            to="/admin/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50"
          >
            Profile
          </Link>
          <Link
            to="/admin/help"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50"
          >
            Help
          </Link>
          <Link
            to="/admin/contact"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50"
          >
            Contact us
          </Link>
          <div className="border-t border-ink-100">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
