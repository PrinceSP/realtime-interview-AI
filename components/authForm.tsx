"use client"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./formField"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormType } from "@/types"
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signIn, signUp } from "@/lib/actions/auth.action"

const authSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // const { name, email, password } = values
        // const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        
        // const result = await signUp({
        //   uid: userCredentials.user.uid, name: name!, email, password
        // })
        
        // if (!result.success) {
        //   toast.error(result.message)
        //   return;
        // }
        
        // toast.success("Account created successfully. Please sign in.")
        // router.push("/sign-in");
        const { name, email, password } = values;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      }
      else {
        const { email, password } = values
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        const idToken = await userCredential.user.getIdToken()

        if (!idToken) {
          toast.error("Sign in failed")
          return
        }

        await signIn({ email, idToken })

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      // console.log(error)
      toast.error("Wrong username or password!")
    }
  }

  const formItems = [
    { name: "name", label: "Username", placeholder: "Your name", type: "text" },
    { name: "email", label: "Email", placeholder: "Your email address", type: "email" },
    { name: "password", label: "Password", placeholder: "Enter your password", type: "password" },
  ]

  const isSign = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="./logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interviews with AI</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {
              formItems.filter((item) => !isSign || item.name !== "name")
                .map((item, index) => (
                  <FormField
                    type={item.type}
                    key={index.toString()}
                    name={item.name}
                    label={item.label}
                    placeholder={item.placeholder}
                    control={form.control}
                  />
                ))
            }
            <Button type="submit" className="btn">{isSign ? "Sign In" : "Create an Account"}</Button>
          </form>
        </Form>

        <p className="text-center">
          {
            isSign ? "No account yet?" : "Already have an account?"
          }
          <Link href={isSign ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
            {isSign ? "Create one" : " Sign In"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
