"use server"

import { feedbackSchema } from "@/constants"
import { db } from "@/firebase/admin"
import { CreateFeedbackParams, Feedback, GetFeedbackByInterviewIdParams, GetLatestInterviewsParams, Interview } from "@/types"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"

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

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interviewData = await db.collection("interviews").doc(id).get()

  return interviewData.data() as Interview | null
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params

  try {
    const formattedTranscript = transcript.map(
      (item: { role: string; content: string; }) =>
        `- ${item.role}: ${item.content}\n`
    ).join("")

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = await db.collection("feedbacks").add({
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString()
    })

    return {
      success: true,
      feedbackId: feedback.id,
    }

  } catch (error) {
    return { success: false }
  }
}

export async function getFeedbackById(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
  const { interviewId, userId } = params
  const feedbackDatas = await db.collection("feedbacks")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get()

  const feedbackDocument = feedbackDatas.docs[0]

  return {
    id: feedbackDocument.id,
    ...feedbackDocument.data()
  } as Feedback
}