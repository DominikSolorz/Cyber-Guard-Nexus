import { useState, useRef } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield, ArrowLeft, Send, Upload, X, FileText,
  User, Mail, Phone, Building2, HelpCircle, AlertTriangle,
  Scale, Briefcase, MessageSquare, CheckCircle2, Loader2,
} from "lucide-react";
import {
  CONTACT_CATEGORY_LABELS, SENDER_TYPE_LABELS,
  CONTACT_PRIORITY_LABELS, CASE_CATEGORY_LABELS,
} from "@shared/schema";

const contactFormSchema = z.object({
  firstName: z.string().min(2, "Imie musi miec min. 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi miec min. 2 znaki"),
  email: z.string().email("Nieprawidlowy adres email"),
  phone: z.string().optional(),
  senderType: z.string().min(1, "Wybierz kim jestes"),
  category: z.string().min(1, "Wybierz kategorie"),
  caseCategory: z.string().optional(),
  subject: z.string().min(5, "Temat musi miec min. 5 znakow"),
  description: z.string().min(20, "Opis musi miec min. 20 znakow"),
  priority: z.string().default("sredni"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const categoryIcons: Record<string, typeof HelpCircle> = {
  pomoc_logowanie: HelpCircle,
  reset_hasla: HelpCircle,
  usuniecie_konta: AlertTriangle,
  odzyskanie_konta: HelpCircle,
  wspolpraca: Briefcase,
  problem_techniczny: AlertTriangle,
  pytanie_prawne: Scale,
  reklamacja: AlertTriangle,
  inne: MessageSquare,
};

export default function Contact() {
  const { toast } = useToast();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      senderType: "",
      category: "",
      caseCategory: "",
      subject: "",
      description: "",
      priority: "sredni",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Blad wysylania");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Wyslano", description: "Twoje zgloszenie zostalo wyslane pomyslnie." });
    },
    onError: (error: Error) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "Plik za duzy", description: "Maksymalny rozmiar pliku to 10MB", variant: "destructive" });
        return;
      }
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectedCategory = form.watch("category");
  const showCaseCategory = selectedCategory === "pytanie_prawne" || selectedCategory === "wspolpraca";

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4 flex-wrap">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
                  <Shield className="h-7 w-7 text-primary" />
                  <span className="text-xl font-bold tracking-tight">
                    Lex<span className="text-primary">Vault</span>
                  </span>
                </div>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="link-back">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Powrot
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3" data-testid="text-success-title">Zgloszenie wyslane</h1>
            <p className="text-muted-foreground mb-6">
              Dziekujemy za kontakt. Twoje zgloszenie zostalo przyjete i zostanie rozpatrzone najszybciej jak to mozliwe. Odpowiemy na podany adres email.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/">
                <Button variant="outline" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Strona glowna
                </Button>
              </Link>
              <Button onClick={() => { setSubmitted(false); form.reset(); setAttachment(null); }} data-testid="button-new-submission">
                <Send className="h-4 w-4 mr-1" />
                Nowe zgloszenie
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 flex-wrap">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
                <Shield className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold tracking-tight">
                  Lex<span className="text-primary">Vault</span>
                </span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-back">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Powrot
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-contact-title">Formularz kontaktowy</h1>
            <p className="text-muted-foreground">
              Wypelnij formularz ponizej, a odpowiemy na Twoje zgloszenie najszybciej jak to mozliwe.
              Wszystkie pola oznaczone * sa wymagane.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Dane kontaktowe</h2>
                      <p className="text-sm text-muted-foreground">Podaj swoje dane, abysmy mogli sie z Toba skontaktowac</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imie *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan" {...field} data-testid="input-first-name" />
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
                          <FormLabel>Nazwisko *</FormLabel>
                          <FormControl>
                            <Input placeholder="Kowalski" {...field} data-testid="input-last-name" />
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
                          <FormLabel>Adres email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jan@example.com" {...field} data-testid="input-email" />
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
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="+48 123 456 789" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Kim jestes?</h2>
                      <p className="text-sm text-muted-foreground">Wybierz typ nadawcy i kategorie zgloszenia</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="senderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Typ nadawcy *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-sender-type">
                                <SelectValue placeholder="Wybierz..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(SENDER_TYPE_LABELS).map(([val, label]) => (
                                <SelectItem key={val} value={val} data-testid={`option-sender-${val}`}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priorytet</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-priority">
                                <SelectValue placeholder="Sredni" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(CONTACT_PRIORITY_LABELS).map(([val, label]) => (
                                <SelectItem key={val} value={val} data-testid={`option-priority-${val}`}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Kategoria zgloszenia</h2>
                      <p className="text-sm text-muted-foreground">Wybierz czego dotyczy Twoje zgloszenie</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategoria pomocy *</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {Object.entries(CONTACT_CATEGORY_LABELS).map(([val, label]) => {
                            const Icon = categoryIcons[val] || MessageSquare;
                            const isSelected = field.value === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => field.onChange(val)}
                                className={`flex items-center gap-2 p-3 rounded-md border text-left text-sm transition-colors ${
                                  isSelected
                                    ? "border-primary bg-primary/10 text-foreground"
                                    : "border-border text-muted-foreground"
                                }`}
                                data-testid={`button-category-${val}`}
                              >
                                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : ""}`} />
                                <span>{label}</span>
                              </button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showCaseCategory && (
                    <FormField
                      control={form.control}
                      name="caseCategory"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Rodzaj sprawy prawnej</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-case-category">
                                <SelectValue placeholder="Wybierz rodzaj sprawy..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(CASE_CATEGORY_LABELS).map(([val, label]) => (
                                <SelectItem key={val} value={val} data-testid={`option-case-${val}`}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Opis zgloszenia</h2>
                      <p className="text-sm text-muted-foreground">Opisz szczegolowo swoja sprawe lub problem</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temat *</FormLabel>
                          <FormControl>
                            <Input placeholder="Krotki opis sprawy..." {...field} data-testid="input-subject" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Szczegolowy opis *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Opisz szczegolowo swoj problem, pytanie lub propozycje wspolpracy. Im wiecej szczegolow podasz, tym szybciej bedziemy mogli Ci pomoc..."
                              className="min-h-[160px] resize-y"
                              {...field}
                              data-testid="input-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Zalacznik</h2>
                      <p className="text-sm text-muted-foreground">Dolacz plik (opcjonalnie) - PDF, JPG, PNG, DOCX do 10MB</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    className="hidden"
                    data-testid="input-file"
                  />

                  {attachment ? (
                    <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-muted/30">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" data-testid="text-file-name">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeAttachment}
                        data-testid="button-remove-file"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      data-testid="button-add-file"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Wybierz plik
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Informacje kontaktowe LexVault</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Email:</p>
                      <a href="mailto:goldservicepoland@gmail.com" className="text-foreground" data-testid="text-owner-email">
                        goldservicepoland@gmail.com
                      </a>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Adres:</p>
                      <p className="text-foreground" data-testid="text-owner-address">
                        Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Link href="/">
                  <Button type="button" variant="outline" data-testid="button-cancel">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anuluj
                  </Button>
                </Link>
                <Button type="submit" disabled={submitMutation.isPending} data-testid="button-submit">
                  {submitMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {submitMutation.isPending ? "Wysylanie..." : "Wyslij zgloszenie"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">LexVault</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/terms">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-terms">Regulamin</span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-privacy">Polityka prywatnosci</span>
            </Link>
            <Link href="/confidentiality">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-confidentiality">Klauzula poufnosci</span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dominik Solarz. Wszelkie prawa zastrzezone.
          </p>
        </div>
      </footer>
    </div>
  );
}
