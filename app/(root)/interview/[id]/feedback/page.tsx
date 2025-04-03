import React from 'react'
import Image from 'next/image'
import { currentUser } from '@/lib/actions/auth.action'
import { getFeedbackById, getInterviewById } from '@/lib/actions/interview.action'
import { RouteParams } from '@/types'
import { redirect } from 'next/navigation'
import { localDefault } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await currentUser()
  const interview = await getInterviewById(id)

  if (!interview) redirect("/")

  const feedbackData = await getFeedbackById({ interviewId: id, userId: user?.id! })

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">Feedback on the Interview — {" "}
          <span className="capitalize">
            {interview.role} Interview
          </span>
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2">
            <Image src="/star.svg" alt="star icon" width={24} height={24} />
            <p>
              Overall Impression: {" "}
              <span className="text-primary-200 font-bold">
                {feedbackData?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" alt="date icon" width={24} height={24} />
            <p className="text-primary-200">
              {feedbackData?.createdAt ?
                localDefault(feedbackData?.createdAt!)
                : "N/A"
              }
            </p>
          </div>

        </div>
      </div>

      <hr />

      <p>{feedbackData?.finalAssessment}</p>

      <div className="flex flex-col gap-4">
        <h2>Breakdown of Evaluation:</h2>

        {
          feedbackData?.categoryScores?.map((item, index) =>
            <div key={item.name} className="gap-4">
              <p className="font-bold">{`${index + 1}. ${item.name}: ${item.score}/20`}</p>
              <p>{item.comment}</p>
            </div>
          )
        }
      </div>

      <div className="flex flex-col gap-4">
        <h2>Areas For Improvement:</h2>
        {
          feedbackData?.areasForImprovement?.map((item, index) =>
            <ul key={index.toString()} className="gap-4">
              <li>{item}</li>
            </ul>
          )
        }
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="w-full">
            <p className="text-sm text-center text-primary-300 font-semibold">Back to Dashboard</p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link href={`/interview/${id}`} className="w-full">
            <p className="text-sm text-center text-black font-semibold">Retake Interview</p>
          </Link>
        </Button>
      </div>

    </section>
  )
}

export default Page