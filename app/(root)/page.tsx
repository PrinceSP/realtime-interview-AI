import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '@/components/interviewCard'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/actions/auth.action'
import { getInterviewByUserId, getLatestInterview } from '@/lib/actions/interview.action'

const Home = async () => {
  const user = await currentUser()
  const [interviewDatas, latestInterview] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterview({ userId: user?.id! })
  ])
  const hasPastInterview = interviewDatas?.length > 0
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-powered Practice & Feedback</h2>
          <p className="text-lg">Get Interview-Ready with AI-powered Practice & Feedback</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robot image" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterview ?
            interviewDatas?.map(item => (
              <InterviewCard key={item.id} {...item} />
            )) :
            <p>You haven&apos; taken any interview yet.</p>
          }
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {
            latestInterview?.length > 0 ?
              latestInterview?.map(latestItem => (
                <InterviewCard key={latestItem.id} {...latestItem} />
              )) :
              <p>There are no interviews available</p>
          }
        </div>
      </section>
    </>
  )
}

export default Home