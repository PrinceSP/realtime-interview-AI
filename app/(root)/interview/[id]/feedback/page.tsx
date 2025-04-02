import { currentUser } from '@/lib/actions/auth.action'
import { getFeedbackById, getInterviewById } from '@/lib/actions/interview.action'
import { RouteParams } from '@/types'
import React from 'react'

const Page = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await currentUser()
  const interview = await getInterviewById(id)

  const feedbackData = await getFeedbackById({ interviewId: id, userId: user?.id! })
  console.log(feedbackData)
  return (
    <div>Page</div>
  )
}

export default Page