import { interviewCovers, mappings } from "@/constants"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function localDefault(date: Date | string) {
  const event = new Date(date)
  const splitDate = event.toUTCString().split(" ")
  const result = splitDate.splice(0, 4)

  return result.join(" ")
}

export function getRandomInterviewCover() {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length)
  return `/covers${interviewCovers[randomIndex]}`
}

export function normaliseName(tech: string) {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings]
}

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normaliseName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-${normalized === "circleci" ? "plain" : (normalized === "amazonwebservices" ? "plain-wordmark" : "original")}.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};