import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsPending(true);
    try {
      await login(data.email, data.password);
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Blad logowania",
        description: error.message || "Nieprawidlowy email lub haslo",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 cursor-pointer" data-testid="link-logo">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight">
                Lex<span className="text-primary">Vault</span>
              </span>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <h1 className="text-xl font-semibold">Logowanie</h1>
            <p className="text-sm text-muted-foreground">Zaloguj sie do swojego konta</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="twoj@email.com" data-testid="input-email" {...field} />
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
                      <FormLabel>Haslo</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Twoje haslo" data-testid="input-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending} data-testid="button-login">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Zaloguj sie
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Nie masz konta? </span>
              <Link href="/register">
                <span className="text-primary font-medium cursor-pointer" data-testid="link-register">Zarejestruj sie</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
