import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, ArrowLeft, ChevronLeft, ChevronRight, Plus, Calendar as CalIcon,
  MapPin, Clock, Scale, Trash2, Gavel
} from "lucide-react";
import { formatDate, formatTime, formatShortDate } from "@/lib/date-utils";
import type { CourtHearing, Case } from "@shared/schema";

function isLawyer(role: string | null | undefined): boolean {
  return role === "adwokat" || role === "radca_prawny";
}

const DAYS_PL = ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Ndz"];
const MONTHS_PL = [
  "Styczen", "Luty", "Marzec", "Kwiecien", "Maj", "Czerwiec",
  "Lipiec", "Sierpien", "Wrzesien", "Pazdziernik", "Listopad", "Grudzien"
];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDow = firstDay.getDay();
  if (startDow === 0) startDow = 7;
  startDow -= 1;

  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - startDow - lastDay.getDate() + 1);
    days.push({ date: d, isCurrentMonth: false });
  }
  return days;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newHearingOpen, setNewHearingOpen] = useState(false);
  const [hearingForm, setHearingForm] = useState({
    caseId: "", title: "", description: "", courtName: "", courtRoom: "",
    date: "", time: "", endTime: "",
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const { data: hearings = [], isLoading } = useQuery<CourtHearing[]>({
    queryKey: ["/api/hearings", year, month],
    queryFn: async () => {
      const start = new Date(year, month, 1).toISOString();
      const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const res = await fetch(`/api/hearings?start=${start}&end=${end}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
    enabled: !!user && isLawyer(user?.role),
  });

  const createHearingMutation = useMutation({
    mutationFn: async () => {
      const startsAt = new Date(`${hearingForm.date}T${hearingForm.time || "09:00"}`);
      const endsAt = hearingForm.endTime ? new Date(`${hearingForm.date}T${hearingForm.endTime}`) : undefined;
      await apiRequest("POST", "/api/hearings", {
        caseId: parseInt(hearingForm.caseId),
        title: hearingForm.title,
        description: hearingForm.description || undefined,
        courtName: hearingForm.courtName || undefined,
        courtRoom: hearingForm.courtRoom || undefined,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt?.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hearings"] });
      setNewHearingOpen(false);
      setHearingForm({ caseId: "", title: "", description: "", courtName: "", courtRoom: "", date: "", time: "", endTime: "" });
      toast({ title: "Termin dodany" });
    },
    onError: (e: any) => toast({ title: "Blad", description: e.message, variant: "destructive" }),
  });

  const deleteHearingMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/hearings/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/hearings"] }); toast({ title: "Termin usuniety" }); },
  });

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const prevWeek = () => setCurrentMonth(new Date(currentMonth.getTime() - 7 * 86400000));
  const nextWeek = () => setCurrentMonth(new Date(currentMonth.getTime() + 7 * 86400000));
  const goToToday = () => { setCurrentMonth(new Date()); setSelectedDate(new Date()); };

  const getWeekDays = useMemo(() => {
    const d = new Date(currentMonth);
    let dow = d.getDay();
    if (dow === 0) dow = 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - dow + 1);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      days.push(dd);
    }
    return days;
  }, [currentMonth.getTime()]);

  const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);
  const today = new Date();

  const getHearingsForDate = (date: Date) => {
    return hearings.filter(h => isSameDay(new Date(h.startsAt), date));
  };

  const selectedDayHearings = selectedDate ? getHearingsForDate(selectedDate) : [];

  if (!user) return null;

  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold" data-testid="text-calendar-title">Kalendarz</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex border border-border rounded-md overflow-visible">
            <Button variant={viewMode === "month" ? "default" : "ghost"} size="sm" className="rounded-none rounded-l-md" onClick={() => setViewMode("month")} data-testid="button-view-month">Miesiac</Button>
            <Button variant={viewMode === "week" ? "default" : "ghost"} size="sm" className="rounded-none rounded-r-md" onClick={() => setViewMode("week")} data-testid="button-view-week">Tydzien</Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday} data-testid="button-today">Dzisiaj</Button>
          {isLawyer(user.role) && (
              <Dialog open={newHearingOpen} onOpenChange={setNewHearingOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-new-hearing"><Plus className="h-4 w-4 mr-1" />Nowy termin</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nowy termin</DialogTitle>
                    <DialogDescription>Dodaj termin rozprawy lub spotkania</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Sprawa *</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={hearingForm.caseId}
                        onChange={(e) => setHearingForm(p => ({ ...p, caseId: e.target.value }))}
                        data-testid="select-hearing-case"
                      >
                        <option value="">Wybierz sprawe...</option>
                        {cases.map(c => (
                          <option key={c.id} value={String(c.id)}>{c.title} {c.caseNumber ? `(${c.caseNumber})` : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Tytul *</Label>
                      <Input value={hearingForm.title} onChange={(e) => setHearingForm(p => ({ ...p, title: e.target.value }))} placeholder="np. Rozprawa glowna" data-testid="input-hearing-title" />
                    </div>
                    <div>
                      <Label>Data *</Label>
                      <Input type="date" value={hearingForm.date} onChange={(e) => setHearingForm(p => ({ ...p, date: e.target.value }))} data-testid="input-hearing-date" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Godzina rozpoczecia</Label>
                        <Input type="time" value={hearingForm.time} onChange={(e) => setHearingForm(p => ({ ...p, time: e.target.value }))} data-testid="input-hearing-time" />
                      </div>
                      <div>
                        <Label>Godzina zakonczenia</Label>
                        <Input type="time" value={hearingForm.endTime} onChange={(e) => setHearingForm(p => ({ ...p, endTime: e.target.value }))} data-testid="input-hearing-end-time" />
                      </div>
                    </div>
                    <div>
                      <Label>Nazwa sadu</Label>
                      <Input value={hearingForm.courtName} onChange={(e) => setHearingForm(p => ({ ...p, courtName: e.target.value }))} placeholder="np. Sad Rejonowy Katowice-Wschod" data-testid="input-hearing-court" />
                    </div>
                    <div>
                      <Label>Sala</Label>
                      <Input value={hearingForm.courtRoom} onChange={(e) => setHearingForm(p => ({ ...p, courtRoom: e.target.value }))} placeholder="np. Sala 205" data-testid="input-hearing-room" />
                    </div>
                    <div>
                      <Label>Opis</Label>
                      <Textarea value={hearingForm.description} onChange={(e) => setHearingForm(p => ({ ...p, description: e.target.value }))} placeholder="Dodatkowe informacje..." data-testid="input-hearing-description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => createHearingMutation.mutate()}
                      disabled={!hearingForm.caseId || !hearingForm.title.trim() || !hearingForm.date || createHearingMutation.isPending}
                      data-testid="button-create-hearing"
                    >
                      Dodaj termin
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={viewMode === "month" ? prevMonth : prevWeek} data-testid="button-prev">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold min-w-[200px] text-center" data-testid="text-current-period">
                    {viewMode === "month"
                      ? `${MONTHS_PL[month]} ${year}`
                      : `${formatShortDate(getWeekDays[0])} - ${formatShortDate(getWeekDays[6])}`}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={viewMode === "month" ? nextMonth : nextWeek} data-testid="button-next">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "month" ? (
                  <div className="grid grid-cols-7 gap-0">
                    {DAYS_PL.map(d => (
                      <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2 border-b border-border">{d}</div>
                    ))}
                    {monthDays.map(({ date, isCurrentMonth }, i) => {
                      const dayHearings = getHearingsForDate(date);
                      const isToday = isSameDay(date, today);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      return (
                        <div
                          key={i}
                          className={`min-h-[80px] p-1 border border-border/30 cursor-pointer transition-colors ${
                            !isCurrentMonth ? "bg-muted/20 text-muted-foreground/50" : ""
                          } ${isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/40"}`}
                          onClick={() => setSelectedDate(date)}
                          data-testid={`calendar-day-${date.getDate()}-${date.getMonth()}`}
                        >
                          <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mx-auto mb-1 ${
                            isToday ? "bg-primary text-primary-foreground" : ""
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-0.5">
                            {dayHearings.slice(0, 2).map(h => (
                              <div key={h.id} className="text-[10px] bg-primary/20 text-primary rounded px-1 py-0.5 truncate leading-tight">
                                {formatTime(h.startsAt)} {h.title}
                              </div>
                            ))}
                            {dayHearings.length > 2 && (
                              <div className="text-[10px] text-muted-foreground text-center">+{dayHearings.length - 2} wiecej</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-0">
                    {DAYS_PL.map(d => (
                      <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2 border-b border-border">{d}</div>
                    ))}
                    {getWeekDays.map((date, i) => {
                      const dayHearings = getHearingsForDate(date);
                      const isToday = isSameDay(date, today);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      return (
                        <div
                          key={i}
                          className={`min-h-[200px] p-2 border border-border/30 cursor-pointer transition-colors ${
                            isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/40"
                          }`}
                          onClick={() => setSelectedDate(date)}
                          data-testid={`week-day-${date.getDate()}-${date.getMonth()}`}
                        >
                          <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mx-auto mb-2 ${
                            isToday ? "bg-primary text-primary-foreground" : ""
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayHearings.map(h => (
                              <div key={h.id} className="text-xs bg-primary/20 text-primary rounded px-1.5 py-1 leading-tight">
                                <div className="font-medium truncate">{formatTime(h.startsAt)}</div>
                                <div className="truncate">{h.title}</div>
                                {h.courtName && <div className="text-[10px] text-muted-foreground truncate">{h.courtName}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CalIcon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    {selectedDate ? formatDate(selectedDate) : "Wybierz dzien"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Kliknij na dzien w kalendarzu, aby zobaczyc terminy
                  </p>
                ) : selectedDayHearings.length === 0 ? (
                  <div className="text-center py-8">
                    <Gavel className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Brak terminow na ten dzien</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayHearings.map(h => (
                      <Card key={h.id} className="overflow-visible" data-testid={`hearing-card-${h.id}`}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-sm">{h.title}</p>
                            </div>
                            {isLawyer(user.role) && (
                              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => deleteHearingMutation.mutate(h.id)} data-testid={`button-delete-hearing-${h.id}`}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(h.startsAt)}{h.endsAt ? ` - ${formatTime(h.endsAt)}` : ""}</span>
                          </div>
                          {h.courtName && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{h.courtName}{h.courtRoom ? `, ${h.courtRoom}` : ""}</span>
                            </div>
                          )}
                          {h.description && (
                            <p className="text-xs text-muted-foreground mt-1">{h.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
