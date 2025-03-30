'use server'

import { auth, db } from "@/firebase/admin";
import { SignInParams, SignUpParams, User } from "@/types";
import { cookies } from "next/headers";

const ONE_DAY = 60 * 60 * 24

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params
  try {
    const userRecord = await db.collection('users').doc(uid).get()

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exist. Please sign in instead."
      }
    }

    await db.collection('users').doc(uid).set({
      name, email,
    })

    return {
      success: true,
      messages: "Account successfully created. Please sign in."
    }
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: "The email is already in use."
      }
    }

    return {
      success: false,
      message: "Failed to create an account"
    }
  }
}

export async function sessionCookie(idToken: string) {
  const cookieStore = await cookies()
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_DAY * 1000
  })

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_DAY,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: 'lax'
  })
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params

  try {
    const userRecord = await auth.getUserByEmail(email)

    if (!userRecord) {
      return {
        success: false,
        message: "User doesn't exist! Create an account instead."
      }
    }

    await sessionCookie(idToken)

  } catch (error) {

    return {
      success: false,
      message: "Failed to sign in to your account."
    }
  }
}

export async function currentUser(): Promise<User | null> {
  const cookieStore = await cookies()

  const sessionCookie = cookieStore.get("session")?.value

  if (!sessionCookie) return null

  try {
    const decodedClaim = await auth.verifySessionCookie(sessionCookie, true)
    const userRecord = await db.collection("users").doc(decodedClaim.uid).get()

    if (!userRecord.exists) return null

    return {
      ...userRecord.data(),
      id: userRecord.id
    } as User

  } catch (error) {
    return null
  }
}

export async function isAuthenticated(){
  const user = await currentUser()

  return !!user
}