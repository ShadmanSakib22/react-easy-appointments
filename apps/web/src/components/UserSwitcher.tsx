import { useUserStore } from '../store/userStore'

export function UserSwitcher() {
  const { users, activeUser, setActiveUser } = useUserStore()

  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-gray-900 border-b border-gray-700">
      <span className="text-gray-400 text-sm font-medium mr-2">Active user:</span>
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => setActiveUser(user.id)}
          className={[
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
            activeUser.id === user.id
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
          ].join(' ')}
        >
          {user.label}
          {user.role === 'admin' && (
            <span className="ml-1.5 text-xs opacity-70">(admin)</span>
          )}
        </button>
      ))}
    </div>
  )
}
