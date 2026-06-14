import { useAuth } from '../../context/AuthContext'
import MenuPage from '../public/MenuPage'

export default function Preview() {
  const { user } = useAuth()

  if (!user?.subdomain) return null

  return (
    <div className="-m-4 sm:-m-6">
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-white">
        Preview — this is what customers see at menufront.ethioserve.com/menu/{user.subdomain}
      </div>
      <MenuPage subdomain={user.subdomain} hideFooter />
    </div>
  )
}
