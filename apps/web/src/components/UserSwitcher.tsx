import { useUserStore } from '../store/userStore'

export function UserSwitcher() {
  const { users, activeUser, setActiveUser } = useUserStore()

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <div className="bg-[#0c1322] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="px-3 pt-2.5 pb-1.5 border-b border-white/[0.07]">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Active User
          </span>
        </div>
        {/* User list */}
        <div className="flex flex-col p-1 gap-0.5">
          {users.map(user => {
            const isActive = activeUser.id === user.id
            const initials = user.label.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
            return (
              <button
                key={user.id}
                onClick={() => setActiveUser(user.id)}
                title={user.label}
                className={[
                  'flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors w-full',
                  isActive
                    ? 'bg-indigo-600/20 text-white'
                    : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-200',
                ].join(' ')}
              >
                {/* Avatar */}
                <span className={[
                  'flex-shrink-0 w-6 h-6 flex items-center justify-center text-[10px] font-bold',
                  isActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400',
                ].join(' ')}>
                  {initials}
                </span>
                <span className="text-sm font-medium leading-none">{user.label}</span>
                {user.role === 'admin' && (
                  <span className="ml-auto text-[10px] text-gray-600">admin</span>
                )}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-indigo-400 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
