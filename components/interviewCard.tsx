import { Feedback, InterviewCardProps } from '@/types'
import React from 'react'
import Image from 'next/image'
import { getRandomInterviewCover, localDefault } from '@/lib/utils'
import { Button } from './ui/button'
import Link from 'next/link'
import TechIcons from './techIcons'
import { getFeedbackById } from '@/lib/actions/interview.action'

const InterviewCard = async ({ id, createdAt, userId, role, techstack, type }: InterviewCardProps) => {
  const feedback = userId && id ? await getFeedbackById({ interviewId: id, userId }) : null
  const normalise = /mix/gi.test(type) ? "Mixed" : type

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className="card-interview">
        <div>
          <div className={`absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg ${normalise == "Mixed" ? "bg-light-600" : "bg-dark-300"}`}>
            <p className="badge-text">{normalise}</p>
          </div>
          <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className="rounded-full object-fit size-[90px]" />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex items-center justify-between">
            <div className="flex">
              <Image src="/calendar.svg" alt="calendar icon" width={22} height={22} />
              <p>{localDefault(createdAt)}</p>
            </div>

            <div className="flex">
              <Image src="/star.svg" alt="star icon" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          <p className="line-clamp-2 mt-5">{feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}</p>
        </div>
        <div className="flex justify-between">
          <TechIcons techStack={techstack} />
          <Button className="btn-primary">
            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}/`}>
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard