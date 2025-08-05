// updateProfileAction.ts
"use server";

import { updateProfile } from "@/app/lib/firebase/firestoreUser";

export async function updateProfileAction(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!userId || !name || !email) {
    return { success: false, message: "All fields are required." };
  }

  try {
    await updateProfile(userId, { name, email });
    return { success: true, message: "Profile updated!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile." };
  }
}
