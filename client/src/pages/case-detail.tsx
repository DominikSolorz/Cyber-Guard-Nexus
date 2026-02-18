import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, ArrowLeft, Send, Paperclip, FileText, Download, Printer,
  Eye, Edit3, Check, X, Volume2, Scale, Loader2
} from "lucide-react";
import type { Case, DirectMessage, MessageAttachment, User } from "@shared/schema";

interface MessageWithAttachments extends DirectMessage {
  attachments: MessageAttachment[];
}

export default function CaseDetail() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const caseId = parseInt(params.id || "0");
  const [inputValue, setInputValue] = useState("");
  const [editingMsgId, setEditingMsgId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: caseData } = useQuery<Case>({
    queryKey: ["/api/cases", caseId],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${caseId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user && caseId > 0,
  });

  const { data: messages = [], isLoading: msgsLoading } = useQuery<MessageWithAttachments[]>({
    queryKey: ["/api/cases", caseId, "messages"],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${caseId}/messages`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user && caseId > 0,
    refetchInterval: 5000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/cases/${caseId}/messages`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", caseId, "messages"] });
      setInputValue("");
    },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  const editMessageMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      await apiRequest("PATCH", `/api/messages/${id}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", caseId, "messages"] });
      setEditingMsgId(null);
      setEditValue("");
    },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/cases/${caseId}/messages/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", caseId, "messages"] });
      toast({ title: "Plik wyslany" });
    },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessageMutation.mutate(inputValue.trim());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: "Synteza mowy niedostepna", variant: "destructive" });
    }
  };

  const printDocument = (url: string) => {
    const w = window.open(url, '_blank');
    if (w) {
      w.addEventListener('load', () => w.print());
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-48" /></div>;
  if (!user) { window.location.href = "/api/login"; return null; }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")} data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Shield className="h-6 w-6 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-lg truncate block">
                Lex<span className="text-primary">Vault</span>
              </span>
            </div>
          </div>
          {caseData && (
            <div className="flex items-center gap-2 min-w-0">
              <Scale className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium truncate" data-testid="text-case-title">{caseData.title}</span>
              {caseData.caseNumber && <Badge variant="secondary" className="shrink-0">{caseData.caseNumber}</Badge>}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-md" />)
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Scale className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Brak wiadomosci. Rozpocznij rozmowe.</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              const isEditing = editingMsgId === msg.id;

              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`} data-testid={`message-${msg.id}`}>
                  <div className={`max-w-[80%] rounded-md ${isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <div className="p-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-background text-foreground"
                            rows={2}
                            data-testid="input-edit-message"
                          />
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="secondary" onClick={() => editMessageMutation.mutate({ id: msg.id, content: editValue })} disabled={editMessageMutation.isPending} data-testid="button-save-edit">
                              <Check className="h-3 w-3 mr-1" />Zapisz
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingMsgId(null)} data-testid="button-cancel-edit">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}

                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.attachments.map((att) => (
                            <div key={att.id} className={`flex items-center gap-2 p-2 rounded-md ${isMine ? "bg-primary-foreground/10" : "bg-background/50"}`}>
                              <FileText className="h-4 w-4 shrink-0" />
                              <span className="text-xs truncate flex-1">{att.fileName}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <a href={`/api/attachments/${att.fileId}/download`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="h-6 w-6" data-testid={`button-preview-${att.id}`}>
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </a>
                                <a href={`/api/attachments/${att.fileId}/download`} download={att.fileName}>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" data-testid={`button-download-${att.id}`}>
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </a>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => printDocument(`/api/attachments/${att.fileId}/download`)} data-testid={`button-print-${att.id}`}>
                                  <Printer className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-1 px-3 pb-2 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] opacity-60">
                        {new Date(msg.createdAt).toLocaleString("pl-PL", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                        {msg.editedAt && " (edytowano)"}
                      </span>
                      <Button variant="ghost" size="icon" className="h-5 w-5 opacity-50 hover:opacity-100" onClick={() => speakText(msg.content)} data-testid={`button-tts-${msg.id}`}>
                        <Volume2 className="h-3 w-3" />
                      </Button>
                      {isMine && !isEditing && (
                        <Button variant="ghost" size="icon" className="h-5 w-5 opacity-50 hover:opacity-100" onClick={() => { setEditingMsgId(msg.id); setEditValue(msg.content); }} data-testid={`button-edit-${msg.id}`}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending} data-testid="button-attach">
              {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            </Button>
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={handleFileUpload} />
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Napisz wiadomosc..."
              className="resize-none min-h-[44px] max-h-[120px]"
              rows={1}
              data-testid="input-message"
            />
            <Button size="icon" onClick={handleSend} disabled={!inputValue.trim() || sendMessageMutation.isPending} data-testid="button-send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
