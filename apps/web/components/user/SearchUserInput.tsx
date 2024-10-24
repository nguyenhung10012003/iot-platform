import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useCallback, useEffect, useState } from 'react';
import api from '../../config/api';
import useDebounce from '../../hooks/useDebounce';
import { User } from '../../types/user';

export default function SearchUserInput({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const debouncedSearchValue = useDebounce(searchValue);

  const searchUser = useCallback(async (searchValue: string) => {
    if (!searchValue) {
      return;
    }

    try {
      const data = await api.get<any, User[]>(`/user/search?q=${searchValue}`);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    searchUser(debouncedSearchValue);
  }, [debouncedSearchValue]);

  const handleOnChooseUser = (user: User) => {
    setSearchValue(user.username);
    setIsOpen(false);
  };

  return (
    <div>
      <Label htmlFor="search-user" className="mb-2">
        Search user
      </Label>
      <Input
        type="text"
        id="search-user"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        //onBlur={() => setIsOpen(false)}
      />
      <div className="relative mt-2 w-full h-full">
        <div
          className="absolute py-2 rounded-md shadow-sm w-full bg-card border"
          hidden={!isOpen || !users.length}
        >
          {users.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 hover:cursor-pointer"
              onClick={() => handleOnChooseUser(user)}
            >
              {user.username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
