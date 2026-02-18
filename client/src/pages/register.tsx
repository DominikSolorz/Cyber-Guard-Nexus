import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { insertUserSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";

type RegisterForm = z.infer<typeof insertUserSchema>;

export default function Register() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as any,
      acceptPrivacy: false as any,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsPending(true);
    try {
      await register(data);
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Blad rejestracji",
        description: error.message || "Nie udalo sie zarejestrowac",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
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
            <h1 className="text-xl font-semibold">Rejestracja</h1>
            <p className="text-sm text-muted-foreground">Stworz swoje konto w LexVault</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imie</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan" data-testid="input-firstName" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwisko</FormLabel>
                        <FormControl>
                          <Input placeholder="Kowalski" data-testid="input-lastName" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jan@example.com" data-testid="input-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer telefonu</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+48 123 456 789" data-testid="input-phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data urodzenia</FormLabel>
                      <FormControl>
                        <Input type="date" data-testid="input-birthDate" {...field} />
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
                        <Input type="password" placeholder="Min. 8 znakow" data-testid="input-password" {...field} />
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
                      <FormLabel>Powtorz haslo</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Powtorz haslo" data-testid="input-confirmPassword" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Akceptuje{" "}
                          <Link href="/terms">
                            <span className="text-primary underline">regulamin</span>
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-privacy"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Akceptuje{" "}
                          <Link href="/privacy">
                            <span className="text-primary underline">polityke prywatnosci (RODO)</span>
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending} data-testid="button-register">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Zarejestruj sie
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Masz juz konto? </span>
              <Link href="/login">
                <span className="text-primary font-medium cursor-pointer" data-testid="link-login">Zaloguj sie</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
