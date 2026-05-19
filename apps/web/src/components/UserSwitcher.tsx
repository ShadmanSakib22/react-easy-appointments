import { useUserStore } from '../store/userStore'

export function UserSwitcher() {
  const { users, activeUser, setActiveUser } = useUserStore()

  return (
    <div className="flex items-center bg-[#111827] border-b border-[#1f2937] overflow-x-auto">
      <div className="flex items-center px-4 sm:px-6 gap-0 min-w-max">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider py-3 mr-4 shrink-0">
          User
        </span>
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => setActiveUser(user.id)}
            className={[
              'relative px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeUser.id === user.id
                ? 'text-white border-indigo-500'
                : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600',
            ].join(' ')}
          >
            {user.label}
            {user.role === 'admin' && (
              <span className="ml-1.5 text-gray-500 text-xs">⚙</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
