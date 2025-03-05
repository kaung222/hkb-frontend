"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Mail, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { toast } from "sonner";
import { SUCCESS_MSG } from "@/constants/general.const.ts";
import { useNavigate } from "react-router-dom";
import { HOME } from "@/constants/pathname.const.ts";
import { useLogin } from "@/api/auth/login";

export const LoginFormSchema = z.object({
  email: z.string().email().min(3, "Invalid Email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LogIn() {
  const [hidden, setHidden] = useState(true);
  const navigate = useNavigate();
  const { mutate, error, isPending: loading } = useLogin();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "hkbservice@gmail.com",
      password: "Admin@123",
    },
  });

  const login = async (data: z.infer<typeof LoginFormSchema>) => {
    mutate(data, {
      onSuccess(res) {
        toast.success(SUCCESS_MSG);
        localStorage.setItem("accessToken", res.accessToken);
        navigate(HOME);
      },
    });
  };

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (accessToken) {
  //     navigate(HOME);
  //   }
  // }, []);

  return (
    <div className="flex items-center justify-center min-h-screen primary-gradient p-4 relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(login)}
          className="w-full max-w-md p-8 bg-white dark:bg-gray-900 dark:text-gray-200 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 rounded-lg shadow-xl space-y-6"
        >
          <h1 className="text-3xl font-semibold text-center text-purple-700 dark:text-purple-300 mb-4">
            Welcome Back
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Please sign in to your account
          </p>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 mt-1 px-3 py-2">
                    <Mail className="text-purple-700 dark:text-purple-300 mr-2" />
                    <Input
                      placeholder="Enter Email"
                      {...field}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 mt-1 px-3 py-2">
                    <Key className="text-purple-700 dark:text-purple-300 mr-2" />
                    <Input
                      type={hidden ? "password" : "text"}
                      placeholder="Enter Password"
                      {...field}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-200"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      type={"button"}
                      onClick={() => setHidden(!hidden)}
                      className="ml-2 text-purple-700 dark:text-purple-300 hover:bg-transparent"
                    >
                      {hidden ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-700 text-white dark:bg-purple-600 dark:text-gray-100 font-semibold hover:bg-purple-600 dark:hover:bg-purple-500 transition-all rounded-lg py-3"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="text-center text-red-600 dark:text-red-400 mt-4">
              {error?.message}
            </div>
          )}
        </form>
      </Form>

      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
    </div>
  );
}
