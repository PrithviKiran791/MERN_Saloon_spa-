import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/ui/form";
import { Input } from "@/components/ui/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/ui/radio-group";
import { Label } from "@/components/ui/ui/label";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { backendUrl } from "@/constants/indes";

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
    role: z.enum(["user", "Admin"]),
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
    <div className="min-h-screen flex items-center justify-center animate-gradient-bg p-4">
      <div className="bg-card rounded-2xl shadow-soft hover:shadow-hover transition-smooth p-8 flex flex-col gap-6 border border-border/50 w-full max-w-md backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-secondary/10">
            <UserPlus className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Create a new Account
          </h1>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="h-11 transition-smooth focus:ring-2 focus:ring-secondary/20"
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
                  <FormLabel className="text-sm font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="h-11 transition-smooth focus:ring-2 focus:ring-secondary/20"
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
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 transition-smooth focus:ring-2 focus:ring-secondary/20"
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
                  <FormLabel className="text-sm font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 transition-smooth focus:ring-2 focus:ring-secondary/20"
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
                  <p className="text-sm font-medium">Select Role</p>
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
                          className="font-normal cursor-pointer"
                        >
                          User
                        </Label>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Admin" id="role-admin" />
                        </FormControl>
                        <Label
                          htmlFor="role-admin"
                          className="font-normal cursor-pointer"
                        >
                          Admin
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="font-bold text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold underline hover:underline transition-smooth text-black"
                >
                  Login
                </Link>
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="secondary"
                className="transition-smooth hover:scale-105 shadow-md to-background-black"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
