"use server"

import { db } from "@/firebase/admin"
import { GetLatestInterviewsParams, Interview } from "@/types"

export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
  const interviewData = await db.collection("interviews")
    .where('userId', '==', userId)
    .orderBy("createdAt", 'desc').get()

  return interviewData.docs.map(item => ({
    id: item.id,
    ...item.data()
  })) as Interview[]
}

export async function getLatestInterview(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params
  const interviewData = await db.collection("interviews")
    .orderBy("createdAt", 'desc')
    .where('finalized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get()

  return interviewData.docs.map(item => ({
    id: item.id,
    ...item.data()
  })) as Interview[]
}