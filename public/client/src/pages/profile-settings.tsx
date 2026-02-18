import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft, Save, User, Lock, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { VOIVODESHIP_LABELS } from "@shared/schema";
import { formatDateTime } from "@/lib/date-utils";
import type { User as UserType } from "@shared/schema";

export default function ProfileSettings() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", street: "",
    city: "", postalCode: "", voivodeship: "", country: "Polska",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        street: user.street || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        voivodeship: user.voivodeship || "",
        country: user.country || "Polska",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/profile", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Profil zaktualizowany" });
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  const roleLabel = user.role === "adwokat" ? "Adwokat" : user.role === "radca_prawny" ? "Radca prawny" : user.role === "firma" ? "Firma" : "Klient indywidualny";

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold" data-testid="text-profile-title">Ustawienia profilu</h1>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <User className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Informacje o koncie</span>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Rola</Label>
                <div className="mt-1">
                  <Badge data-testid="text-role">{roleLabel}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm mt-1" data-testid="text-email">{user.email || "Brak"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Weryfikacja email</Label>
                <div className="mt-1">
                  <Badge variant={user.emailVerified ? "default" : "destructive"} data-testid="text-email-verified">
                    {user.emailVerified ? "Zweryfikowany" : "Niezweryfikowany"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Data rejestracji</Label>
                <p className="text-sm mt-1" data-testid="text-created-at">{formatDateTime(user.createdAt)}</p>
              </div>
            </div>

            {user.role === "adwokat" || user.role === "radca_prawny" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                {user.barNumber && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Numer wpisu</Label>
                    <p className="text-sm mt-1" data-testid="text-bar-number">{user.barNumber}</p>
                  </div>
                )}
                {user.nip && (
                  <div>
                    <Label className="text-xs text-muted-foreground">NIP</Label>
                    <p className="text-sm mt-1" data-testid="text-nip">{user.nip}</p>
                  </div>
                )}
              </div>
            ) : null}

            {user.role === "firma" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                {user.companyName && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Nazwa firmy</Label>
                    <p className="text-sm mt-1" data-testid="text-company">{user.companyName}</p>
                  </div>
                )}
                {user.nip && (
                  <div>
                    <Label className="text-xs text-muted-foreground">NIP</Label>
                    <p className="text-sm mt-1" data-testid="text-nip">{user.nip}</p>
                  </div>
                )}
              </div>
            ) : null}

            {user.pesel && (
              <div className="pt-2 border-t border-border">
                <Label className="text-xs text-muted-foreground">PESEL</Label>
                <p className="text-sm mt-1" data-testid="text-pesel">{"***" + user.pesel.slice(-4)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Dane kontaktowe</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Imie</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))} data-testid="input-profile-first-name" />
              </div>
              <div>
                <Label htmlFor="lastName">Nazwisko</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))} data-testid="input-profile-last-name" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+48 123 456 789" data-testid="input-profile-phone" />
            </div>
            <div>
              <Label htmlFor="street">Ulica</Label>
              <Input id="street" value={formData.street} onChange={(e) => setFormData(p => ({ ...p, street: e.target.value }))} placeholder="ul. Przykladowa 1/2" data-testid="input-profile-street" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Kod pocztowy</Label>
                <Input id="postalCode" value={formData.postalCode} onChange={(e) => setFormData(p => ({ ...p, postalCode: e.target.value }))} placeholder="00-000" data-testid="input-profile-postal" />
              </div>
              <div>
                <Label htmlFor="city">Miasto</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))} placeholder="Katowice" data-testid="input-profile-city" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voivodeship">Wojewodztwo</Label>
                <select
                  id="voivodeship"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.voivodeship}
                  onChange={(e) => setFormData(p => ({ ...p, voivodeship: e.target.value }))}
                  data-testid="select-profile-voivodeship"
                >
                  <option value="">Wybierz...</option>
                  {Object.entries(VOIVODESHIP_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="country">Kraj</Label>
                <Input id="country" value={formData.country} onChange={(e) => setFormData(p => ({ ...p, country: e.target.value }))} data-testid="input-profile-country" />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} data-testid="button-save-profile">
                <Save className="h-4 w-4 mr-1" />
                {updateMutation.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
