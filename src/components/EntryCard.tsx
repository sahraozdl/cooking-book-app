'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toggleRecipeLike, toggleRecipeSave } from '@/app/actions/firestoreRecipeActions';
import { useUser } from '@/store/UserContext';
import { RecipeWithID } from '@/types';
import EditModal from '@/components/EditModal';
import NewRecipeForm from '@/components/forms/NewRecipeForm';
import ActionIconButton from '@/components/buttons/ActionIconButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import {
  HeartIcon,
  StarIcon,
  BowlFoodIcon,
  ClockCountdownIcon,
  GlobeHemisphereEastIcon,
} from '@phosphor-icons/react';

interface EntryCardProps {
  entry: RecipeWithID;
  showAuthor?: boolean;
  editable?: boolean;
  onDelete?: () => void;
  onUpdate?: (updatedData: Partial<RecipeWithID>) => void;
  isDeleting?: boolean;
}

export default function EntryCard({
  entry,
  showAuthor = true,
  editable = false,
  onDelete,
  isDeleting = false,
}: EntryCardProps) {
  const { user } = useUser();
  const router = useRouter();

  const userId = user?.id;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLiked(false);
      setSaved(false);
      return;
    }
    setLiked(entry.likedBy?.includes(userId) ?? false);
    setSaved(entry.savedBy?.includes(userId) ?? false);
  }, [entry, userId]);

  const handleToggle = async (type: 'like' | 'save') => {
    if (!userId) {
      router.push('/login');
      return;
    }
    if (!entry.id) return;

    const toggler = type === 'like' ? toggleRecipeLike : toggleRecipeSave;
    const currentState = type === 'like' ? liked : saved;
    const newState = !currentState;

    try {
      if (type === 'like') setLiked(newState);
      else setSaved(newState);

      const countKey = type === 'like' ? 'likeCount' : 'saveCount';
      const byKey = type === 'like' ? 'likedBy' : 'savedBy';

      entry[countKey] = Math.max(
        (entry[countKey] ?? entry[byKey]?.length ?? 0) + (newState ? 1 : -1),
        0
      );

      entry[byKey] = newState
        ? [...(entry[byKey] ?? []), userId]
        : (entry[byKey] ?? []).filter((id) => id !== userId);

      await toggler(entry.id, userId);
    } catch (error) {
      console.error(`Failed to toggle ${type}:`, error);
      if (type === 'like') setLiked(currentState);
      else setSaved(currentState);
    }
  };

  return (
    <div
      data-testid="entry-card"
      className="border rounded-xl p-4 shadow-sm bg-white text-gray-800"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {entry.strMealThumb && (
          <Image
            src={entry.strMealThumb}
            alt={entry.strMeal}
            width={100}
            height={100}
            className="rounded-lg object-cover w-24 h-24"
          />
        )}

        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-lg font-semibold">{entry.strMeal}</h3>

            <div className="flex flex-row flex-wrap gap-4 text-xs text-gray-500 min-w-1/6">
              <div className="flex items-center gap-1">
                <BowlFoodIcon size={16} />
                <span>{entry.servingsId?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockCountdownIcon size={16} />
                <span>{entry.difficultyId?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <GlobeHemisphereEastIcon size={16} />
                <span>{entry.cuisineId?.name}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-3">{entry.strInstructions}</p>

          {showAuthor && entry.authorId && (
            <p className="text-sm">
              By:{' '}
              {entry.isAnonymous ? (
                'Anonymous'
              ) : (
                <Link
                  href={`/profile/${entry.authorId}`}
                  className="text-orange-600 hover:underline"
                >
                  {entry.authorName}
                </Link>
              )}
            </p>
          )}

          <div className="flex flex-wrap gap-3 items-center">
            <ActionIconButton
              active={liked}
              onClick={() => handleToggle('like')}
              icon={<HeartIcon size={16} />}
              activeIcon={<HeartIcon size={16} weight="fill" />}
              label="Like "
              count={entry.likeCount ?? entry.likedBy?.length ?? 0}
            />

            <ActionIconButton
              active={saved}
              onClick={() => handleToggle('save')}
              icon={<StarIcon size={16} />}
              activeIcon={<StarIcon size={16} weight="fill" />}
              label="Save"
              count={entry.saveCount ?? entry.savedBy?.length ?? 0}
            />

            <Link
              href={`/recipes/${entry.id}`}
              className="ml-auto text-orange-500 hover:underline text-sm"
              data-testid="view-full-recipe-link"
            >
              View full recipe
            </Link>

            {editable && (
              <div className="flex flex-wrap gap-2 ml-2">
                <PrimaryButton onClick={() => setShowEditModal(true)}>Edit</PrimaryButton>
                <SecondaryButton onClick={onDelete} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </SecondaryButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {editable && (
        <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Recipe"
        >
          <NewRecipeForm recipe={entry} onClose={() => setShowEditModal(false)} />
        </EditModal>
      )}
    </div>
  );
}
