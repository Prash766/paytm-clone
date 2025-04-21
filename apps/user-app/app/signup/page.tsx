"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  
} from "@repo/ui/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userSignUpSchema } from "../../schemas/signup.schema";
import FormButton from "../../components/Button";
import { signup } from "../../actions/signUpAction";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const form = useForm<z.infer<typeof userSignUpSchema>>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      number: "",
      password: "",
    }, 
  });

 async function onSubmit(){
    console.log("hi ther ")
    const res = await signup(form.getValues())
    if(res.success===true){
        await signIn("credentials",{
           email: form.getValues().email,
           password : form.getValues().password,
           redirect:true,
           callbackUrl:"/"
        })
    }
    console.log("res",res)
  }

  return (
    <div className="w-32">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your Username" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
          />

        <FormField
        name="email"
        control={form.control}
        render={({field})=>(
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your Email" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
         <FormField
        name="password"
        control={form.control}
        render={({field})=>(
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter your password" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
          <FormField
        name="number"
        control={form.control}
        render={({field})=>(
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="text" placeholder="+91 982321****" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
        <FormButton type="submit" className="mt-2 bg-red-400 w-28 rounded-xl">Save</FormButton>
        </form>
      </Form>
    </div>
  );
}
