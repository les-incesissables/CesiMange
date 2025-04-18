'use client';
import React from 'react';

interface UserItem {
    imageUrl: string;
    username: string;
    email: string;
}

interface UserCardListProps {
    users?: UserItem[];
}

const UserCardList: React.FC<UserCardListProps> = () => {
    return (
        <ul className="flex flex-wrap gap-4">
            {/* {users.map((user, index) => (
                <li key={index}>
                    <UserCard imageUrl={user.imageUrl} username={user.username} email={user.email} />
                </li>
            ))} */}
        </ul>
    );
};

export default UserCardList;
