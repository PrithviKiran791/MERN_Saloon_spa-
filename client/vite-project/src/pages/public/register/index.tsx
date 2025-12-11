import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { WarpBackground } from "@/components/ui/shadcn-io/warp-background";
import { backendUrl } from "@/constants";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100),
    email: z.string().trim().email("Invalid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.enum(["user", "owner"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const [loading, setloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const isSubmitting = loading;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setloading(true);
      const response = await axios.post(
        `${backendUrl}/users/register`,
        values
      );
      if (response.data.success) {
        toast.success("Registration successful! Please login.");
        form.reset();
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white p-4">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="fixed top-8 left-8 px-4 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all hover:scale-105 z-20"
      >
        ← Back to Home
      </Link>

      <div className="pointer-events-none absolute inset-0">
        <WarpBackground
          perspective={120}
          beamsPerSide={4}
          beamSize={6}
          beamDuration={4.5}
          className="min-h-full w-full p-0 border-0 rounded-none bg-transparent"
        >
          <div className="min-h-full" />
        </WarpBackground>
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/5 backdrop-blur-lg shadow-lg shadow-black/30 p-8 flex flex-col gap-6 animate-scale-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-white/10">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Create a new Account
            </h1>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="h-11 bg-white/10 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 focus:border-white/60 transition-all-smooth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="h-11 bg-white/10 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 focus:border-white/60 transition-all-smooth"
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
                      className="h-11 bg-white/10 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 focus:border-white/60 transition-all-smooth"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-white/10 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 focus:border-white/60 transition-all-smooth"
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
                  {/* Use plain text instead of FormLabel to avoid invalid <label for> */}
                  <p className="text-sm font-medium text-white">Select Role</p>
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
                        <Label
                          htmlFor="role-user"
                          className="font-normal cursor-pointer text-white"
                        >
                          User
                        </Label>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="owner" id="role-owner" />
                        </FormControl>
                        <Label
                          htmlFor="role-owner"
                          className="font-normal cursor-pointer text-white"
                        >
                          Owner
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="font-bold text-white/85">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold underline hover:underline transition-smooth text-white"
                >
                  Login
                </Link>
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="transition-all-smooth hover-scale shadow-md hover:shadow-glow btn-glow bg-white/80 text-black hover:bg-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner w-4 h-4"></span>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
