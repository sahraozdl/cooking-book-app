'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  followUser,
  unfollowUser,
  getUserById,
  getUserFollowers,
  getUserFollowing,
} from '@/app/lib/firebase/firestoreUser';
import { useUser } from '@/store/UserContext';
import { UserTypes, RecipeWithID } from '@/types';
import { getUserPublicRecipes } from '@/app/actions/firestoreRecipeActions';
import RecipeList from '@/components/RecipeList';
import PrimaryButton from '@/components/buttons/PrimaryButton';

export default function UserProfilePage() {
  const { user } = useUser();
  const params = useParams();
  const userId = typeof params?.userId === 'string' ? params.userId : '';

  const [targetUser, setTargetUser] = useState<UserTypes | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [recipes, setRecipes] = useState<RecipeWithID[]>([]);
  const [followers, setFollowers] = useState<UserTypes[]>([]);
  const [following, setFollowing] = useState<UserTypes[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const data = await getUserById(userId);
      if (!data) return;

      setTargetUser(data);

      if (user?.id) {
        setIsFollowing(user.following?.includes(userId) ?? false);
      }

      const fetchedRecipes = await getUserPublicRecipes(userId);
      setRecipes(fetchedRecipes);
    };

    const fetchFollowData = async () => {
      const [followerData, followingData] = await Promise.all([
        getUserFollowers(userId),
        getUserFollowing(userId),
      ]);
      setFollowers(followerData);
      setFollowing(followingData);
    };

    fetchData();
    fetchFollowData();
  }, [userId, user?.id, user?.following]);

  const handleFollowToggle = async () => {
    if (!user?.id || !targetUser?.id) return;
    if (isFollowing) {
      await unfollowUser(user.id, targetUser.id);
    } else {
      await followUser(user.id, targetUser.id);
    }
    setIsFollowing((prev) => !prev);
  };

  if (!targetUser) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 text-gray-900">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{targetUser.name}</h1>
          <p className="text-gray-900">{targetUser.email}</p>
        </div>
        <div>
          {user && user.id !== userId && (
            <PrimaryButton onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </PrimaryButton>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-6">Followers: {followers.length}</h2>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {followers.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-6">Following: {following.length}</h2>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {following.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Recipes by {targetUser.name}</h2>
        <RecipeList recipes={recipes} editable={false} />
      </div>
    </div>
  );
}
