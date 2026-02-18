import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, ArrowLeft, Send, Plus, Trash2, MessageSquare, Loader2,
  Paperclip, X, Download, ImageIcon
} from "lucide-react";
import type { Conversation, Message } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";

export default function Chat() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: conversations = [], isLoading: convsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/chat/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/chat/conversations", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: messages = [], isLoading: msgsLoading } = useQuery<Message[]>({
    queryKey: ["/api/chat/conversations", activeConversationId, "messages"],
    queryFn: async () => {
      if (!activeConversationId) return [];
      const res = await fetch(`/api/chat/conversations/${activeConversationId}/messages`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!activeConversationId && !!user,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/chat/conversations", { title: "Nowa rozmowa" });
      return res.json();
    },
    onSuccess: (conv: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      setActiveConversationId(conv.id);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/chat/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      if (activeConversationId) {
        setActiveConversationId(null);
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendMessage = async () => {
    if ((!inputValue.trim() && !attachedFile) || !activeConversationId || isStreaming) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsStreaming(true);
    setStreamingContent("");

    const currentFile = attachedFile;
    setAttachedFile(null);

    try {
      let response: Response;

      if (currentFile) {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("file", currentFile);
        response = await fetch(`/api/chat/conversations/${activeConversationId}/messages`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } else {
        response = await fetch(`/api/chat/conversations/${activeConversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        });
      }

      if (!response.ok) throw new Error("Blad wysylania");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              accumulated += data.content;
              setStreamingContent(accumulated);
            }
            if (data.done) {
              setStreamingContent("");
              setIsStreaming(false);
              queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations", activeConversationId, "messages"] });
            }
            if (data.error) {
              toast({ title: "Blad", description: data.error, variant: "destructive" });
            }
          } catch {}
        }
      }
    } catch (error: any) {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(!\[.*?\]\(https?:\/\/[^\)]+\))/g);
    return parts.map((part, i) => {
      const imgMatch = part.match(/!\[(.*?)\]\((https?:\/\/[^\)]+)\)/);
      if (imgMatch) {
        const [, alt, url] = imgMatch;
        return (
          <div key={i} className="my-2">
            <img src={url} alt={alt} className="max-w-full rounded-md max-h-80 object-contain" />
            <div className="flex items-center gap-2 mt-1">
              <a href={url} download target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" data-testid={`button-download-image-${i}`}>
                  <Download className="h-3 w-3 mr-1" /> Pobierz
                </Button>
              </a>
            </div>
          </div>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")} data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">
              Lex<span className="text-primary">Vault</span>
              <span className="text-muted-foreground font-normal ml-2 text-sm">Asystent AI</span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-border flex flex-col bg-card/50 shrink-0 hidden md:flex">
          <div className="p-3 border-b border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => createConversationMutation.mutate()}
              disabled={createConversationMutation.isPending}
              data-testid="button-new-conversation"
            >
              <Plus className="h-4 w-4 mr-1" />
              Nowa rozmowa
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {convsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))
            ) : conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Brak rozmow</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center gap-2 rounded-md p-2 cursor-pointer group transition-colors ${
                    activeConversationId === conv.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveConversationId(conv.id)}
                  data-testid={`button-conversation-${conv.id}`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate flex-1">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 invisible group-hover:visible"
                    onClick={(e) => { e.stopPropagation(); deleteConversationMutation.mutate(conv.id); }}
                    data-testid={`button-delete-conversation-${conv.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          {!activeConversationId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Asystent AI</h3>
                <p className="text-sm text-muted-foreground/70 mb-4 max-w-md">
                  Pytaj o prawo, analizuj dokumenty, generuj obrazy, lub rozmawiaj na dowolny temat.
                </p>
                <Button
                  onClick={() => createConversationMutation.mutate()}
                  disabled={createConversationMutation.isPending}
                  data-testid="button-start-chat"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Rozpocznij rozmowe
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {msgsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-md" />
                  ))
                ) : messages.length === 0 && !streamingContent ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">Napisz wiadomosc lub przeslij plik, aby rozpoczac rozmowe.</p>
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground/60">
                        <span className="bg-muted rounded-md px-2 py-1">Pytania prawne</span>
                        <span className="bg-muted rounded-md px-2 py-1">Analiza obrazow</span>
                        <span className="bg-muted rounded-md px-2 py-1">Generowanie obrazow</span>
                        <span className="bg-muted rounded-md px-2 py-1">Dowolne tematy</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-md p-3 text-sm whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {msg.role === "assistant" ? renderMessageContent(msg.content) : msg.content}
                        </div>
                      </div>
                    ))}
                    {streamingContent && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-md p-3 text-sm bg-muted text-foreground whitespace-pre-wrap">
                          {renderMessageContent(streamingContent)}
                          <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-text-bottom" />
                        </div>
                      </div>
                    )}
                    {isStreaming && !streamingContent && (
                      <div className="flex justify-start">
                        <div className="rounded-md p-3 bg-muted">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-4">
                {attachedFile && (
                  <div className="flex items-center gap-2 mb-2 bg-muted rounded-md px-3 py-1.5 text-sm">
                    {attachedFile.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate flex-1">{attachedFile.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{(attachedFile.size / 1024).toFixed(1)} KB</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setAttachedFile(null)} data-testid="button-remove-attachment">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isStreaming}
                    data-testid="button-attach-file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.gif,.webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setAttachedFile(f);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  />
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Napisz wiadomosc..."
                    className="resize-none min-h-[44px] max-h-[120px] flex-1"
                    rows={1}
                    disabled={isStreaming}
                    data-testid="input-chat-message"
                  />
                  <Button
                    size="icon"
                    onClick={sendMessage}
                    disabled={(!inputValue.trim() && !attachedFile) || isStreaming}
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
