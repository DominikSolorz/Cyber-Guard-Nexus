import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <Shield className="h-16 w-16 text-primary/30 mb-6" />
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <p className="text-xl font-medium mb-1">Strona nie znaleziona</p>
      <p className="text-muted-foreground mb-6">Strona, ktorej szukasz, nie istnieje.</p>
      <Link href="/">
        <Button data-testid="button-go-home">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Wroc na strone glowna
        </Button>
      </Link>
    </div>
  );
}
