import { getTechLogos } from '@/lib/utils'
import { TechIconProps } from '@/types'
import Image from 'next/image'
import React from 'react'

const TechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack)
  return (
    <div className="flex flex-row">
      {techIcons.map(({ tech, url }, index) =>
        <div key={tech} className={`relative group bg-dark-300 rounded-full p-2 flex-center ${index > 0 && "-ml-3"}`}>
          <span className="tech-tooltip">{tech}</span>
          <Image src={url} alt={tech} width={100} height={100} className='size-5' />
        </div>
      )}
    </div>
  )
}

export default TechIcons