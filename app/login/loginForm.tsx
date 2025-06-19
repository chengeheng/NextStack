"use client";

import * as React from "react";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginFetcher } from "@/client/apis/login";

type LoginFormProps = React.HTMLAttributes<HTMLDivElement>;

function LoginForm({ className, ...props }: LoginFormProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation("/api/login", loginFetcher, {
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Handle successful login here, e.g., redirect or show a success message
    },
    onError: async (error) => {
      console.error("Login failed:", error);
      // Handle login error here, e.g., show an error message
    },
  });

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    trigger({
      username,
      password,
    }).then(() => {
      // Redirect to the home page or another page after successful login
      router.push("/admin");
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid grid-cols-1 gap-[8px]">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="username"
              placeholder="username"
              type="username"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isMutating}
            />
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isMutating}
            />
          </div>
          <Button disabled={isMutating}>
            {
              isMutating && <Loader /> // You can replace this with an icon if needed
            }
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isMutating}>
        GitHub
      </Button>
    </div>
  );
}

export default LoginForm;
