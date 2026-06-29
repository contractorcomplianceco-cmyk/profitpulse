import { useState } from "react";
import { Link } from "wouter";
import { Building2, DollarSign, FileText, Receipt, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProfitPulse,
  createEmptyRevenue,
  createEmptyExpense,
  createEmptyInvoice,
  createEmptyFacility,
} from "@/context/ProfitPulseProvider";
import { useToast } from "@/hooks/use-toast";
import { updateChecklistItem } from "@/lib/profit-pulse/onboarding";
import type { RevenueRecord, ExpenseRecord, Invoice, Facility } from "@/lib/profit-pulse/types";

type QuickType = "revenue" | "expense" | "invoice" | "facility" | null;

export function ExecutiveQuickActions() {
  const { state, upsertRevenue, upsertExpense, upsertInvoice, upsertFacility } = useProfitPulse();
  const { toast } = useToast();
  const [open, setOpen] = useState<QuickType>(null);
  const [revenue, setRevenue] = useState<RevenueRecord>(() => createEmptyRevenue());
  const [expense, setExpense] = useState<ExpenseRecord>(() => createEmptyExpense());
  const [invoice, setInvoice] = useState<Invoice>(() => createEmptyInvoice());
  const [facility, setFacility] = useState<Facility>(() => createEmptyFacility());

  const accountOptions = state.accounts.map((a) => ({ value: a.id, label: a.name }));

  const openForm = (type: QuickType) => {
    if (type === "revenue") setRevenue(createEmptyRevenue(state.accounts[0]?.id));
    if (type === "expense") setExpense(createEmptyExpense());
    if (type === "invoice") setInvoice(createEmptyInvoice(state.accounts[0]?.id));
    if (type === "facility") setFacility(createEmptyFacility(state.accounts[0]?.id));
    setOpen(type);
  };

  const save = () => {
    if (open === "revenue") {
      if (!revenue.description.trim() || revenue.amount <= 0) {
        toast({ title: "Missing fields", description: "Description and amount are required.", variant: "destructive" });
        return;
      }
      upsertRevenue(revenue);
      updateChecklistItem("addRevenue", true);
      toast({ title: "Revenue added", description: `${revenue.description} saved.` });
    }
    if (open === "expense") {
      if (!expense.description.trim() || expense.amount <= 0) {
        toast({ title: "Missing fields", description: "Description and amount are required.", variant: "destructive" });
        return;
      }
      upsertExpense(expense);
      toast({ title: "Expense added", description: `${expense.description} saved.` });
    }
    if (open === "invoice") {
      if (!invoice.invoiceNumber.trim() || invoice.amount <= 0) {
        toast({ title: "Missing fields", description: "Invoice # and amount are required.", variant: "destructive" });
        return;
      }
      upsertInvoice(invoice);
      toast({ title: "Invoice added", description: `${invoice.invoiceNumber} saved.` });
    }
    if (open === "facility") {
      if (!facility.name.trim() || !facility.accountId) {
        toast({ title: "Missing fields", description: "Facility name and account are required.", variant: "destructive" });
        return;
      }
      upsertFacility(facility);
      updateChecklistItem("reviewFacilities", true);
      toast({ title: "Facility added", description: `${facility.name} saved.` });
    }
    setOpen(null);
  };

  const actions = [
    { type: "revenue" as const, label: "Add revenue", icon: DollarSign },
    { type: "expense" as const, label: "Add expense", icon: Receipt },
    { type: "invoice" as const, label: "Add invoice", icon: FileText },
    { type: "facility" as const, label: "Add facility", icon: Building2 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-3 shadow-soft">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mr-1">Quick actions</span>
      {actions.map(({ type, label, icon: Icon }) => (
        <Button key={type} size="sm" variant="secondary" className="h-8 gap-1.5 text-xs font-bold" onClick={() => openForm(type)}>
          <Icon className="w-3.5 h-3.5" />
          {label}
        </Button>
      ))}
      <Link href="/scenario-builder">
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-bold border-primary/40">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Scenario modeler
        </Button>
      </Link>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {open === "revenue" && "Add revenue"}
              {open === "expense" && "Add expense"}
              {open === "invoice" && "Add invoice"}
              {open === "facility" && "Add facility"}
            </DialogTitle>
          </DialogHeader>

          {open === "revenue" && (
            <div className="space-y-3 py-2">
              <Field label="Date"><Input type="date" value={revenue.date} onChange={(e) => setRevenue({ ...revenue, date: e.target.value })} /></Field>
              <Field label="Account">
                <Select value={revenue.accountId} onValueChange={(v) => setRevenue({ ...revenue, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>{accountOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Category"><Input value={revenue.category} onChange={(e) => setRevenue({ ...revenue, category: e.target.value })} placeholder="Compliance Retainer" /></Field>
              <Field label="Description"><Input value={revenue.description} onChange={(e) => setRevenue({ ...revenue, description: e.target.value })} /></Field>
              <Field label="Amount ($)"><Input type="number" min={0} step={100} value={revenue.amount || ""} onChange={(e) => setRevenue({ ...revenue, amount: Number(e.target.value) })} /></Field>
            </div>
          )}

          {open === "expense" && (
            <div className="space-y-3 py-2">
              <Field label="Date"><Input type="date" value={expense.date} onChange={(e) => setExpense({ ...expense, date: e.target.value })} /></Field>
              <Field label="Category"><Input value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })} placeholder="Payroll" /></Field>
              <Field label="Vendor"><Input value={expense.vendor} onChange={(e) => setExpense({ ...expense, vendor: e.target.value })} /></Field>
              <Field label="Description"><Input value={expense.description} onChange={(e) => setExpense({ ...expense, description: e.target.value })} /></Field>
              <Field label="Amount ($)"><Input type="number" min={0} step={100} value={expense.amount || ""} onChange={(e) => setExpense({ ...expense, amount: Number(e.target.value) })} /></Field>
            </div>
          )}

          {open === "invoice" && (
            <div className="space-y-3 py-2">
              <Field label="Invoice #"><Input value={invoice.invoiceNumber} onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })} placeholder="INV-2025-0001" /></Field>
              <Field label="Account">
                <Select value={invoice.accountId} onValueChange={(v) => setInvoice({ ...invoice, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>{accountOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Due date"><Input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} /></Field>
              <Field label="Amount ($)"><Input type="number" min={0} step={100} value={invoice.amount || ""} onChange={(e) => setInvoice({ ...invoice, amount: Number(e.target.value) })} /></Field>
              <Field label="Status">
                <Select value={invoice.status} onValueChange={(v) => setInvoice({ ...invoice, status: v as Invoice["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["draft", "sent", "partial", "paid", "overdue"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {open === "facility" && (
            <div className="space-y-3 py-2">
              <Field label="Facility name"><Input value={facility.name} onChange={(e) => setFacility({ ...facility, name: e.target.value })} /></Field>
              <Field label="Account">
                <Select value={facility.accountId} onValueChange={(v) => setFacility({ ...facility, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>{accountOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Location"><Input value={facility.location} onChange={(e) => setFacility({ ...facility, location: e.target.value })} /></Field>
              <Field label="Health score (0–100)"><Input type="number" min={0} max={100} value={facility.healthScore} onChange={(e) => setFacility({ ...facility, healthScore: Number(e.target.value) })} /></Field>
              <Field label="Opportunity value ($)"><Input type="number" min={0} step={1000} value={facility.revenueOpportunity || ""} onChange={(e) => setFacility({ ...facility, revenueOpportunity: Number(e.target.value) })} /></Field>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
