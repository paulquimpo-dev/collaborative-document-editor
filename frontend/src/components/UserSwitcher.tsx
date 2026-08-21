import type { User } from "../types";

interface UserSwitcherProps {
  users: User[];
  activeUserId: number | null;
  disabled: boolean;
  onChange: (userId: number) => void;
}

export function UserSwitcher({ users, activeUserId, disabled, onChange }: UserSwitcherProps) {
  return (
    <div className="user-switcher">
      <label htmlFor="active-user">Viewing as</label>
      <select
        id="active-user"
        value={activeUserId ?? ""}
        disabled={disabled || users.length === 0}
        onChange={(event) => {
          const requestedUserId = Number(event.target.value);
          if (activeUserId !== null) event.currentTarget.value = String(activeUserId);
          onChange(requestedUserId);
        }}
      >
        {users.length === 0 && <option value="">No users available</option>}
        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
      </select>
    </div>
  );
}
