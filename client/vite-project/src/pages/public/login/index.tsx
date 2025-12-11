import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { backendUrl } from "@/constants";
import Cookies from "js-cookie";
import { WritingText } from "@/components/ui/shadcn-io/writing-text";

const formSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "owner"]),
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/users/login`, values);
      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }
      const { data } = response.data;
      Cookies.set("token", data);
      Cookies.set("role", response.data.role);
      console.log("Login successful. Token:", data);
      toast.success("Login successful!");
      navigate(`/${response.data.role}/dashboard`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="fixed top-8 left-8 px-4 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all hover:scale-105"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/5 backdrop-blur-lg shadow-lg shadow-black/30 p-8 flex flex-col gap-6 text-white">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-white/10">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <WritingText
            text="Welcome Back"
            inView={true}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 2,
              delay: 0.3
            }}
            className="text-3xl font-bold tracking-tight"
          />
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="h-11 bg-white/10 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 focus:border-white/60 transition-smooth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-white/10 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 focus:border-white/60 transition-smooth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-white">
                    Select Role
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" id="role-user" />
                        </FormControl>
                        <FormLabel htmlFor="role-user" className="font-normal cursor-pointer text-white">
                          User
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="owner" id="role-owner" />
                        </FormControl>
                        <FormLabel htmlFor="role-owner" className="font-normal cursor-pointer text-white">
                          Owner
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-sm text-white/80">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white underline hover:underline transition-smooth font-semibold"
                >
                  Register
                </Link>
              </p>
              <Button
                type="submit"
                disabled={loading}
                className="transition-smooth hover:scale-105 shadow-md bg-white/80 text-black hover:bg-white"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;