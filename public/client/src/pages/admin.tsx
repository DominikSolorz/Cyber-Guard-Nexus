import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Shield, ArrowLeft, Users, Trash2, ShieldOff, Eye, Mail, Phone, MapPin
} from "lucide-react";
import type { User } from "@shared/schema";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const { data: allUsers = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (res.status === 403) throw new Error("Brak uprawnien");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDeleteUserId(null);
      toast({ title: "Uzytkownik usuniety" });
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  if (!user.isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <ShieldOff className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Brak uprawnien</h3>
          <p className="text-sm text-muted-foreground/70 mb-4">
            Nie masz uprawnien administratora.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Uzytkownicy</h2>
          <Badge variant="secondary" className="ml-auto">{allUsers.length}</Badge>
        </div>

        {usersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-md" />
            ))}
          </div>
        ) : allUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Brak uzytkownikow</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allUsers.map((u) => (
              <Card key={u.id} data-testid={`card-user-${u.id}`}>
                <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    {u.profileImageUrl ? (
                      <img src={u.profileImageUrl} alt="" className="w-8 h-8 rounded-md object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {(u.firstName?.[0] || u.email?.[0] || "?").toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" data-testid={`text-user-name-${u.id}`}>
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{u.email || "Brak emaila"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.role && (
                      <Badge variant="secondary">
                        {u.role === "adwokat" ? "Adwokat" : u.role === "radca_prawny" ? "Radca prawny" : u.role === "firma" ? "Firma" : "Klient"}
                      </Badge>
                    )}
                    {u.isAdmin && <Badge variant="default">Admin</Badge>}
                    {u.emailVerified && <Badge variant="outline">Email zweryfikowany</Badge>}
                    {u.id !== user.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteUserId(u.id)}
                        data-testid={`button-delete-user-${u.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      <Dialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usunac uzytkownika?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Ta operacja usunie uzytkownika i wszystkie jego dane (foldery, pliki, rozmowy). Tej operacji nie mozna cofnac.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>Anuluj</Button>
            <Button
              variant="destructive"
              onClick={() => deleteUserId && deleteUserMutation.mutate(deleteUserId)}
              disabled={deleteUserMutation.isPending}
              data-testid="button-confirm-delete-user"
            >
              Usun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
