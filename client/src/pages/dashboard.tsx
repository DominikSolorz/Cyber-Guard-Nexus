import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, LogOut, FolderPlus, Upload, Search, Trash2, Edit3,
  Folder, FileText, Image, File as FileIcon, ChevronRight,
  MoreVertical, X, Eye, Home
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Folder as FolderType, File as FileType } from "@shared/schema";

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState<FolderType | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renamingFile, setRenamingFile] = useState<FileType | null>(null);
  const [renameFileValue, setRenameFileValue] = useState("");
  const [previewFile, setPreviewFile] = useState<FileType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: folders = [], isLoading: foldersLoading } = useQuery<FolderType[]>({
    queryKey: ["/api/folders"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: files = [], isLoading: filesLoading } = useQuery<FileType[]>({
    queryKey: ["/api/files", currentFolderId ? String(currentFolderId) : "root"],
    queryFn: async () => {
      const url = currentFolderId ? `/api/files?folderId=${currentFolderId}` : "/api/files";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json();
    },
  });

  const { data: searchResults } = useQuery<{ folders: FolderType[]; files: FileType[] }>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { folders: [], files: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/folders", {
        name,
        parentFolderId: currentFolderId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setNewFolderName("");
      setNewFolderOpen(false);
      toast({ title: "Folder utworzony" });
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  const renameFolderMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await apiRequest("PATCH", `/api/folders/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setRenamingFolder(null);
      toast({ title: "Folder zaktualizowany" });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/folders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({ title: "Folder usuniety" });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({ title: "Plik przeslany" });
    },
    onError: (error: any) => {
      toast({ title: "Blad przesylania", description: error.message, variant: "destructive" });
    },
  });

  const renameFileMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await apiRequest("PATCH", `/api/files/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      setRenamingFile(null);
      toast({ title: "Plik zaktualizowany" });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({ title: "Plik usuniety" });
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || !currentFolderId) {
      toast({ title: "Wybierz folder", description: "Najpierw wejdz do folderu, aby przeslac pliki", variant: "destructive" });
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

  const currentFolders = folders.filter((f) =>
    currentFolderId ? f.parentFolderId === currentFolderId : !f.parentFolderId
  );

  const breadcrumbs = getBreadcrumbs(folders, currentFolderId);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-5 w-5 text-green-500" />;
    if (type === "application/pdf") return <FileText className="h-5 w-5 text-primary" />;
    return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const isSearching = searchQuery.trim().length > 0;
  const displayFolders = isSearching ? (searchResults?.folders || []) : currentFolders;
  const displayFiles = isSearching ? (searchResults?.files || []) : files;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline">
              Lex<span className="text-primary">Vault</span>
            </span>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Szukaj po nazwie lub sygnaturze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline" data-testid="text-username">
              {user.firstName} {user.lastName}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-sm flex-wrap">
            <button
              onClick={() => { setCurrentFolderId(null); setSearchQuery(""); }}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              data-testid="button-root"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Moje sprawy</span>
            </button>
            {breadcrumbs.map((bc) => (
              <span key={bc.id} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <button
                  onClick={() => setCurrentFolderId(bc.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`button-breadcrumb-${bc.id}`}
                >
                  {bc.name}
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-new-folder">
                  <FolderPlus className="h-4 w-4 mr-1" />
                  Nowy folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nowy folder</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Nazwa folderu"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && newFolderName.trim() && createFolderMutation.mutate(newFolderName.trim())}
                  data-testid="input-folder-name"
                />
                <DialogFooter>
                  <Button
                    onClick={() => newFolderName.trim() && createFolderMutation.mutate(newFolderName.trim())}
                    disabled={!newFolderName.trim() || createFolderMutation.isPending}
                    data-testid="button-create-folder"
                  >
                    Utworz
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={!currentFolderId}
              data-testid="button-upload"
            >
              <Upload className="h-4 w-4 mr-1" />
              Przeslij plik
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              multiple
              onChange={handleFileUpload}
              data-testid="input-file"
            />
          </div>
        </div>

        <main className="flex-1 p-4">
          {(foldersLoading || filesLoading) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-md" />
              ))}
            </div>
          ) : displayFolders.length === 0 && displayFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Folder className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-1">
                {isSearching ? "Brak wynikow" : "Brak zawartosci"}
              </h3>
              <p className="text-sm text-muted-foreground/70">
                {isSearching
                  ? "Sprobuj innego zapytania"
                  : "Utworz folder lub przeslij plik, aby rozpoczac"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayFolders.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Foldery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {displayFolders.map((folder) => (
                      <Card
                        key={folder.id}
                        className="hover-elevate cursor-pointer group"
                        data-testid={`card-folder-${folder.id}`}
                      >
                        <CardContent className="p-3 flex items-center justify-between gap-2">
                          <div
                            className="flex items-center gap-3 min-w-0 flex-1"
                            onClick={() => { setCurrentFolderId(folder.id); setSearchQuery(""); }}
                          >
                            <Folder className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-sm font-medium truncate">{folder.name}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" data-testid={`button-folder-menu-${folder.id}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => { setRenamingFolder(folder); setRenameValue(folder.name); }}
                                data-testid={`button-rename-folder-${folder.id}`}
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Zmien nazwe
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteFolderMutation.mutate(folder.id)}
                                className="text-destructive"
                                data-testid={`button-delete-folder-${folder.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Usun
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {displayFiles.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Pliki</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {displayFiles.map((file) => (
                      <Card
                        key={file.id}
                        className="hover-elevate cursor-pointer group"
                        data-testid={`card-file-${file.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div
                              className="flex items-center gap-3 min-w-0 flex-1"
                              onClick={() => setPreviewFile(file)}
                            >
                              {getFileIcon(file.type)}
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0 invisible group-hover:visible" data-testid={`button-file-menu-${file.id}`}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setPreviewFile(file)} data-testid={`button-preview-file-${file.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Podglad
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => { setRenamingFile(file); setRenameFileValue(file.name); }}
                                  data-testid={`button-rename-file-${file.id}`}
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Zmien nazwe
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteFileMutation.mutate(file.id)}
                                  className="text-destructive"
                                  data-testid={`button-delete-file-${file.id}`}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Usun
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {file.type.startsWith("image/") && (
                            <div className="mt-2 rounded-md overflow-hidden bg-muted aspect-video" onClick={() => setPreviewFile(file)}>
                              <img
                                src={`/api/files/${file.id}/download`}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!renamingFolder} onOpenChange={(open) => !open && setRenamingFolder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmien nazwe folderu</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && renamingFolder && renameValue.trim() && renameFolderMutation.mutate({ id: renamingFolder.id, name: renameValue.trim() })}
            data-testid="input-rename-folder"
          />
          <DialogFooter>
            <Button
              onClick={() => renamingFolder && renameValue.trim() && renameFolderMutation.mutate({ id: renamingFolder.id, name: renameValue.trim() })}
              disabled={!renameValue.trim()}
              data-testid="button-confirm-rename-folder"
            >
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renamingFile} onOpenChange={(open) => !open && setRenamingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmien nazwe pliku</DialogTitle>
          </DialogHeader>
          <Input
            value={renameFileValue}
            onChange={(e) => setRenameFileValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && renamingFile && renameFileValue.trim() && renameFileMutation.mutate({ id: renamingFile.id, name: renameFileValue.trim() })}
            data-testid="input-rename-file"
          />
          <DialogFooter>
            <Button
              onClick={() => renamingFile && renameFileValue.trim() && renameFileMutation.mutate({ id: renamingFile.id, name: renameFileValue.trim() })}
              disabled={!renameFileValue.trim()}
              data-testid="button-confirm-rename-file"
            >
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewFile && getFileIcon(previewFile.type)}
              {previewFile?.name}
            </DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="overflow-auto max-h-[70vh]">
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={`/api/files/${previewFile.id}/download`}
                  alt={previewFile.name}
                  className="w-full rounded-md"
                />
              ) : previewFile.type === "application/pdf" ? (
                <iframe
                  src={`/api/files/${previewFile.id}/download`}
                  className="w-full h-[70vh] rounded-md"
                  title={previewFile.name}
                />
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <FileIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Podglad niedostepny dla tego typu pliku</p>
                  <a
                    href={`/api/files/${previewFile.id}/download`}
                    download={previewFile.name}
                    className="mt-3"
                  >
                    <Button variant="outline" size="sm">Pobierz plik</Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getBreadcrumbs(folders: FolderType[], currentId: number | null): FolderType[] {
  if (!currentId) return [];
  const crumbs: FolderType[] = [];
  let id: number | null = currentId;
  while (id) {
    const folder = folders.find((f) => f.id === id);
    if (!folder) break;
    crumbs.unshift(folder);
    id = folder.parentFolderId;
  }
  return crumbs;
}
