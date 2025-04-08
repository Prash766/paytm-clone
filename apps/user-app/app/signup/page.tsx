"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useForm,
} from "@repo/ui/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userSignUpSchema } from "../../schemas/signup.schema";

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

  function onSubmit(){
    
  }

  return (
    <div className="">
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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter your password" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
        </form>
      </Form>
    </div>
  );
}
