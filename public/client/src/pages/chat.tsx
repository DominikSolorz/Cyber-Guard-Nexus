import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Send, Plus, Trash2, MessageSquare, Loader2,
  Paperclip, X, Download, ImageIcon, Mic, MicOff, Volume2, VolumeX, Square
} from "lucide-react";
import type { Conversation, Message } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";

const SpeechRecognitionAPI = typeof window !== "undefined"
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null;

export default function Chat() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const lastSpokenRef = useRef<string>("");
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

  const speakText = useCallback((text: string, messageId?: number) => {
    if (!("speechSynthesis" in window)) {
      toast({ title: "Synteza mowy niedostepna w tej przegladarce", variant: "destructive" });
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/!\[.*?\]\(https?:\/\/[^\)]+\)/g, "")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .trim();
    if (!cleanText) return;

    const maxLen = 200;
    const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
    let chunks: string[] = [];
    let current = "";
    for (const s of sentences) {
      if ((current + s).length > maxLen && current) {
        chunks.push(current.trim());
        current = s;
      } else {
        current += s;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    setSpeakingMessageId(messageId ?? -1);
    const speak = (index: number) => {
      if (index >= chunks.length) {
        setSpeakingMessageId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = "pl-PL";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => speak(index + 1);
      utterance.onerror = () => { setSpeakingMessageId(null); };
      window.speechSynthesis.speak(utterance);
    };
    speak(0);
  }, [toast]);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, []);

  const toggleListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      toast({ title: "Rozpoznawanie mowy niedostepne", description: "Uzyj Chrome lub Edge", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim = transcript;
        }
      }
      setInputValue((finalTranscript + interim).trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        toast({ title: "Blad mikrofonu", description: event.error, variant: "destructive" });
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, toast]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const sendMessage = async () => {
    if ((!inputValue.trim() && !attachedFile) || !activeConversationId || isStreaming) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

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
              if (autoSpeak && accumulated) {
                lastSpokenRef.current = accumulated;
                speakText(accumulated);
              }
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

  if (!user) return null;

  return (
    <div className="h-full flex overflow-hidden">
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
                Pisz, mow glosem, analizuj dokumenty, generuj obrazy - rozmawiaj na dowolny temat.
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
            <div className="flex items-center justify-end gap-1 px-4 py-2 border-b border-border shrink-0">
              <Button
                variant={autoSpeak ? "default" : "ghost"}
                size="sm"
                onClick={() => setAutoSpeak(!autoSpeak)}
                className="toggle-elevate"
                data-testid="button-toggle-auto-speak"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Auto-glos</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {msgsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-md" />
                ))
              ) : messages.length === 0 && !streamingContent ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Napisz wiadomosc, nagraj glos lub przeslij plik.</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground/60">
                      <span className="bg-muted rounded-md px-2 py-1">Pytania prawne</span>
                      <span className="bg-muted rounded-md px-2 py-1">Analiza obrazow</span>
                      <span className="bg-muted rounded-md px-2 py-1">Rozmowa glosowa</span>
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
                      <div className={`max-w-[80%] rounded-md text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground p-3"
                          : "bg-muted text-foreground"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div>
                            <div className="p-3 pb-1">{renderMessageContent(msg.content)}</div>
                            <div className="flex items-center gap-1 px-2 pb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  if (speakingMessageId === msg.id) {
                                    stopSpeaking();
                                  } else {
                                    speakText(msg.content, msg.id);
                                  }
                                }}
                                data-testid={`button-speak-${msg.id}`}
                              >
                                {speakingMessageId === msg.id ? (
                                  <><Square className="h-3 w-3 mr-1" /> Stop</>
                                ) : (
                                  <><Volume2 className="h-3 w-3 mr-1" /> Odsluchaj</>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : msg.content}
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
              {isListening && (
                <div className="flex items-center gap-2 mb-2 text-sm text-primary">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                  </span>
                  Nagrywanie... mow teraz
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
                <Button
                  variant={isListening ? "destructive" : "ghost"}
                  size="icon"
                  onClick={toggleListening}
                  disabled={isStreaming}
                  data-testid="button-mic"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isListening ? "Nagrywam glos..." : "Napisz wiadomosc..."}
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
  );
}
