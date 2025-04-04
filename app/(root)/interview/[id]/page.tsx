import Image from "next/image"
import { RouteParams } from "@/types"
import { getInterviewById } from "@/lib/actions/interview.action"
import { redirect } from "next/navigation"
import { getRandomInterviewCover, getTechLogos } from "@/lib/utils"
import TechIcons from "@/components/techIcons"
import Agent from "@/components/agent"
import { userAgent } from "next/server"
import { currentUser } from "@/lib/actions/auth.action"

const Page = async ({ params }: RouteParams) => {
  const { id } = await params
  const interview = await getInterviewById(id)
  const user = await currentUser()

  if (!interview) redirect("/")

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center mx-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image src={getRandomInterviewCover()} alt="text logo" width={40} height={40} className="rounded-full object-cover size-[40px]" />
            <h3 className="capitalize">{interview.role}</h3>
          </div>
          <TechIcons techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">{interview.type}</p>
      </div>

      <Agent
        userName={user?.name! || ''}
        userId={user?.id!}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </>
  )
}

export default Page