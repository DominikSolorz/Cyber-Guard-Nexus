import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, LogOut, FolderPlus, Upload, Search, Trash2, Edit3,
  Folder, FileText, Image, File as FileIcon, ChevronRight,
  MoreVertical, Eye, Home, MessageSquare, Users, Plus,
  Scale, Briefcase, User, Building2
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import type { Folder as FolderType, File as FileType, ClientRecord, Case } from "@shared/schema";

function isLawyer(role: string | null | undefined): boolean {
  return role === "adwokat" || role === "radca_prawny";
}

export default function Dashboard() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>;
  }
  if (!user) { window.location.href = "/api/login"; return null; }
  if (!user.onboardingCompleted) { window.location.href = "/onboarding"; return null; }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline">Lex<span className="text-primary">Vault</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/chat")} data-testid="button-chat">
              <MessageSquare className="h-4 w-4 mr-1" /><span className="hidden md:inline">Czat AI</span>
            </Button>
            {user.isAdmin && (
              <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} data-testid="button-admin">
                <Users className="h-4 w-4 mr-1" /><span className="hidden md:inline">Admin</span>
              </Button>
            )}
            <Badge variant="secondary" className="hidden md:inline-flex">
              {user.role === "adwokat" ? "Adwokat" : user.role === "radca_prawny" ? "Radca prawny" : user.role === "firma" ? "Firma" : "Klient"}
            </Badge>
            <span className="text-sm text-muted-foreground hidden lg:inline" data-testid="text-username">
              {user.firstName} {user.lastName}
            </span>
            <Button variant="ghost" size="icon" onClick={() => logout()} data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {isLawyer(user.role) ? (
          <LawyerDashboard />
        ) : (
          <ClientDashboard />
        )}
      </main>
    </div>
  );
}

function LawyerDashboard() {
  const [activeTab, setActiveTab] = useState("cases");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="cases" data-testid="tab-cases">Sprawy</TabsTrigger>
        <TabsTrigger value="clients" data-testid="tab-clients">Klienci</TabsTrigger>
        <TabsTrigger value="documents" data-testid="tab-documents">Dokumenty</TabsTrigger>
      </TabsList>

      <TabsContent value="cases"><CasesPanel /></TabsContent>
      <TabsContent value="clients"><ClientsPanel /></TabsContent>
      <TabsContent value="documents"><DocumentsPanel /></TabsContent>
    </Tabs>
  );
}

function ClientDashboard() {
  const [, setLocation] = useLocation();

  const { data: myCases = [], isLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" data-testid="text-client-title">Moje sprawy</h2>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-md" />)}</div>
      ) : myCases.length === 0 ? (
        <div className="text-center py-20">
          <Scale className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Brak spraw</h3>
          <p className="text-sm text-muted-foreground/70">Twoj prawnik doda sprawe, ktora bedzie tutaj widoczna.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCases.map((c) => (
            <Card key={c.id} className="hover-elevate cursor-pointer" onClick={() => setLocation(`/case/${c.id}`)} data-testid={`card-case-${c.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Scale className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-medium truncate">{c.title}</span>
                </div>
                {c.caseNumber && <p className="text-xs text-muted-foreground">Sygn.: {c.caseNumber}</p>}
                <Badge variant={c.status === "active" ? "default" : "secondary"} className="mt-2">
                  {c.status === "active" ? "Aktywna" : c.status === "closed" ? "Zamknieta" : c.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CasesPanel() {
  const [, setLocation] = useLocation();
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [caseForm, setCaseForm] = useState({ title: "", caseNumber: "", description: "", clientRecordId: "" });
  const { toast } = useToast();

  const { data: allCases = [], isLoading } = useQuery<Case[]>({ queryKey: ["/api/cases"] });
  const { data: clients = [] } = useQuery<ClientRecord[]>({ queryKey: ["/api/clients"] });

  const createCaseMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cases", {
        title: caseForm.title,
        caseNumber: caseForm.caseNumber || undefined,
        description: caseForm.description || undefined,
        clientRecordId: caseForm.clientRecordId ? parseInt(caseForm.clientRecordId) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setNewCaseOpen(false);
      setCaseForm({ title: "", caseNumber: "", description: "", clientRecordId: "" });
      toast({ title: "Sprawa utworzona" });
    },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  const deleteCaseMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/cases/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/cases"] }); toast({ title: "Sprawa usunieta" }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-xl font-semibold" data-testid="text-cases-title">Sprawy ({allCases.length})</h2>
        <Dialog open={newCaseOpen} onOpenChange={setNewCaseOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-case"><Plus className="h-4 w-4 mr-1" />Nowa sprawa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nowa sprawa</DialogTitle>
              <DialogDescription>Uzupelnij dane nowej sprawy</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Tytul sprawy *</Label>
                <Input value={caseForm.title} onChange={(e) => setCaseForm(p => ({ ...p, title: e.target.value }))} placeholder="np. Sprawa rozwodowa Kowalski" data-testid="input-case-title" />
              </div>
              <div>
                <Label>Sygnatura</Label>
                <Input value={caseForm.caseNumber} onChange={(e) => setCaseForm(p => ({ ...p, caseNumber: e.target.value }))} placeholder="np. III C 123/24" data-testid="input-case-number" />
              </div>
              <div>
                <Label>Klient</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={caseForm.clientRecordId}
                  onChange={(e) => setCaseForm(p => ({ ...p, clientRecordId: e.target.value }))}
                  data-testid="select-client"
                >
                  <option value="">Bez klienta</option>
                  {clients.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Opis</Label>
                <Textarea value={caseForm.description} onChange={(e) => setCaseForm(p => ({ ...p, description: e.target.value }))} placeholder="Opis sprawy..." data-testid="input-case-description" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => createCaseMutation.mutate()} disabled={!caseForm.title.trim() || createCaseMutation.isPending} data-testid="button-create-case">Utworz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-md" />)}</div>
      ) : allCases.length === 0 ? (
        <div className="text-center py-16">
          <Scale className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Brak spraw</h3>
          <p className="text-sm text-muted-foreground/70">Dodaj pierwsza sprawe</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCases.map((c) => {
            const client = clients.find(cl => cl.id === c.clientRecordId);
            return (
              <Card key={c.id} className="hover-elevate cursor-pointer group" data-testid={`card-case-${c.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1" onClick={() => setLocation(`/case/${c.id}`)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium truncate">{c.title}</span>
                      </div>
                      {c.caseNumber && <p className="text-xs text-muted-foreground mb-1">Sygn.: {c.caseNumber}</p>}
                      {client && <p className="text-xs text-muted-foreground">Klient: {client.firstName} {client.lastName}</p>}
                      <Badge variant={c.status === "active" ? "default" : "secondary"} className="mt-2">
                        {c.status === "active" ? "Aktywna" : "Zamknieta"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" data-testid={`button-case-menu-${c.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLocation(`/case/${c.id}`)} data-testid={`button-open-case-${c.id}`}>
                          <Eye className="h-4 w-4 mr-2" />Otworz
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCaseMutation.mutate(c.id)} className="text-destructive" data-testid={`button-delete-case-${c.id}`}>
                          <Trash2 className="h-4 w-4 mr-2" />Usun
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClientsPanel() {
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    firstName: "", lastName: "", pesel: "", email: "", phone: "", address: "", city: "", postalCode: "", notes: ""
  });
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<ClientRecord[]>({ queryKey: ["/api/clients"] });

  const createClientMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", "/api/clients", clientForm); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setNewClientOpen(false);
      setClientForm({ firstName: "", lastName: "", pesel: "", email: "", phone: "", address: "", city: "", postalCode: "", notes: "" });
      toast({ title: "Klient dodany" });
    },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/clients/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/clients"] }); toast({ title: "Klient usuniety" }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-xl font-semibold" data-testid="text-clients-title">Klienci ({clients.length})</h2>
        <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-client"><Plus className="h-4 w-4 mr-1" />Dodaj klienta</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nowy klient</DialogTitle>
              <DialogDescription>Wprowadz dane klienta</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Imie *</Label><Input value={clientForm.firstName} onChange={(e) => setClientForm(p => ({ ...p, firstName: e.target.value }))} placeholder="Jan" data-testid="input-client-first-name" /></div>
                <div><Label>Nazwisko *</Label><Input value={clientForm.lastName} onChange={(e) => setClientForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Kowalski" data-testid="input-client-last-name" /></div>
              </div>
              <div><Label>PESEL</Label><Input value={clientForm.pesel} onChange={(e) => setClientForm(p => ({ ...p, pesel: e.target.value }))} placeholder="12345678901" data-testid="input-client-pesel" /></div>
              <div><Label>Email</Label><Input type="email" value={clientForm.email} onChange={(e) => setClientForm(p => ({ ...p, email: e.target.value }))} placeholder="jan@kowalski.pl" data-testid="input-client-email" /></div>
              <div><Label>Telefon</Label><Input value={clientForm.phone} onChange={(e) => setClientForm(p => ({ ...p, phone: e.target.value }))} placeholder="+48 123 456 789" data-testid="input-client-phone" /></div>
              <div><Label>Adres</Label><Input value={clientForm.address} onChange={(e) => setClientForm(p => ({ ...p, address: e.target.value }))} placeholder="ul. Przykladowa 1" data-testid="input-client-address" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Kod pocztowy</Label><Input value={clientForm.postalCode} onChange={(e) => setClientForm(p => ({ ...p, postalCode: e.target.value }))} placeholder="00-000" data-testid="input-client-postal" /></div>
                <div><Label>Miasto</Label><Input value={clientForm.city} onChange={(e) => setClientForm(p => ({ ...p, city: e.target.value }))} placeholder="Katowice" data-testid="input-client-city" /></div>
              </div>
              <div><Label>Notatki</Label><Textarea value={clientForm.notes} onChange={(e) => setClientForm(p => ({ ...p, notes: e.target.value }))} placeholder="Dodatkowe informacje..." data-testid="input-client-notes" /></div>
            </div>
            <DialogFooter>
              <Button onClick={() => createClientMutation.mutate()} disabled={!clientForm.firstName.trim() || !clientForm.lastName.trim() || createClientMutation.isPending} data-testid="button-create-client">Dodaj</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-md" />)}</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Brak klientow</h3>
          <p className="text-sm text-muted-foreground/70">Dodaj pierwszego klienta</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <Card key={c.id} className="group" data-testid={`card-client-${c.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium truncate">{c.firstName} {c.lastName}</span>
                    </div>
                    {c.pesel && <p className="text-xs text-muted-foreground">PESEL: {c.pesel}</p>}
                    {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                    {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
                    {c.address && <p className="text-xs text-muted-foreground mt-1">{c.address}{c.city ? `, ${c.postalCode} ${c.city}` : ""}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" onClick={() => deleteClientMutation.mutate(c.id)} data-testid={`button-delete-client-${c.id}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsPanel() {
  const { user } = useAuth();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: folders = [], isLoading: foldersLoading } = useQuery<FolderType[]>({
    queryKey: ["/api/folders"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  const { data: files = [], isLoading: filesLoading } = useQuery<FileType[]>({
    queryKey: ["/api/files", currentFolderId ? String(currentFolderId) : "root"],
    queryFn: async () => {
      const url = currentFolderId ? `/api/files?folderId=${currentFolderId}` : "/api/files";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: searchResults } = useQuery<{ folders: FolderType[]; files: FileType[] }>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { folders: [], files: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, { credentials: "include" });
      return res.json();
    },
    enabled: searchQuery.trim().length > 0 && !!user,
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      await apiRequest("POST", "/api/folders", { name, parentFolderId: currentFolderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setNewFolderName("");
      setNewFolderOpen(false);
      toast({ title: "Folder utworzony" });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/folders/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/folders"] }); queryClient.invalidateQueries({ queryKey: ["/api/files"] }); },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/files/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/files"] }); toast({ title: "Plik przeslany" }); },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/files/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/files"] }); },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || !currentFolderId) {
      toast({ title: "Wybierz folder", description: "Najpierw wejdz do folderu", variant: "destructive" });
      return;
    }
    for (let i = 0; i < uploadedFiles.length; i++) {
      const formData = new FormData();
      formData.append("file", uploadedFiles[i]);
      formData.append("folderId", String(currentFolderId));
      uploadFileMutation.mutate(formData);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentFolders = folders.filter((f) => currentFolderId ? f.parentFolderId === currentFolderId : !f.parentFolderId);
  const breadcrumbs = getBreadcrumbs(folders, currentFolderId);
  const isSearching = searchQuery.trim().length > 0;
  const displayFolders = isSearching ? (searchResults?.folders || []) : currentFolders;
  const displayFiles = isSearching ? (searchResults?.files || []) : files;

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-5 w-5 text-green-500" />;
    if (type === "application/pdf") return <FileText className="h-5 w-5 text-primary" />;
    return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-sm flex-wrap">
          <button onClick={() => { setCurrentFolderId(null); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1" data-testid="button-root">
            <Home className="h-3.5 w-3.5" /><span>Dokumenty</span>
          </button>
          {breadcrumbs.map((bc) => (
            <span key={bc.id} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <button onClick={() => setCurrentFolderId(bc.id)} className="text-muted-foreground hover:text-foreground transition-colors">{bc.name}</button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Szukaj..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-48" data-testid="input-search" />
          </div>
          <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" data-testid="button-new-folder"><FolderPlus className="h-4 w-4 mr-1" />Folder</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nowy folder</DialogTitle><DialogDescription>Podaj nazwe nowego folderu</DialogDescription></DialogHeader>
              <Input placeholder="Nazwa folderu" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && newFolderName.trim() && createFolderMutation.mutate(newFolderName.trim())} data-testid="input-folder-name" />
              <DialogFooter>
                <Button onClick={() => newFolderName.trim() && createFolderMutation.mutate(newFolderName.trim())} disabled={!newFolderName.trim()} data-testid="button-create-folder">Utworz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!currentFolderId} data-testid="button-upload">
            <Upload className="h-4 w-4 mr-1" />Plik
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" multiple onChange={handleFileUpload} />
        </div>
      </div>

      {displayFolders.length === 0 && displayFiles.length === 0 ? (
        <div className="text-center py-16">
          <Folder className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-1">{isSearching ? "Brak wynikow" : "Brak zawartosci"}</h3>
          <p className="text-sm text-muted-foreground/70">{isSearching ? "Sprobuj innego zapytania" : "Utworz folder lub przeslij plik"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayFolders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayFolders.map((folder) => (
                <Card key={folder.id} className="hover-elevate cursor-pointer group" data-testid={`card-folder-${folder.id}`}>
                  <CardContent className="p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1" onClick={() => { setCurrentFolderId(folder.id); setSearchQuery(""); }}>
                      <Folder className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate">{folder.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" onClick={() => deleteFolderMutation.mutate(folder.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {displayFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayFiles.map((file) => (
                <Card key={file.id} className="hover-elevate group" data-testid={`card-file-${file.id}`}>
                  <CardContent className="p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getFileIcon(file.type)}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a href={`/api/files/${file.id}/download`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible"><Eye className="h-4 w-4" /></Button>
                      </a>
                      <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" onClick={() => deleteFileMutation.mutate(file.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getBreadcrumbs(folders: FolderType[], currentId: number | null): FolderType[] {
  const result: FolderType[] = [];
  let id = currentId;
  while (id) {
    const folder = folders.find((f) => f.id === id);
    if (!folder) break;
    result.unshift(folder);
    id = folder.parentFolderId;
  }
  return result;
}
