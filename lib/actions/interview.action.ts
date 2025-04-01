import { db } from "@/firebase/admin";
import { Interview } from "@/types";

export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
  const interviewData = await db.collection("interviews")
    .where('userId', '==', userId)
    .orderBy("createdAt", 'desc').get()

  return interviewData.docs.map(item => ({
    id: item.id,
    ...item.data()
  })) as Interview[]
}