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
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
                  <FormLabel className="text-sm font-medium">
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
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          User
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Admin" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Admin
                        </FormLabel>
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
                  className="font-medium underline hover:underline transition-smooth font-semibold text-black"
                >
                  Login
                </Link>
              </p>
              <Button
                type="submit"
                variant="secondary"
                className="transition-smooth hover:scale-105 shadow-md to-background-black"
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
