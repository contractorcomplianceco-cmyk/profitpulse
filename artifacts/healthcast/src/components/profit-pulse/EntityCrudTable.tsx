import { useMemo, useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export interface FieldDef<T> {
  key: keyof T;
  label: string;
  type?: "text" | "number" | "currency" | "date" | "textarea" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  step?: number;
}

interface EntityCrudTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  records: T[];
  columns: { key: keyof T; label: string; format?: (value: unknown, row: T) => ReactNode }[];
  fields: FieldDef<T>[];
  emptyMessage?: string;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  onSave: (record: T) => void;
  onDelete: (id: string) => void;
  createRecord: () => T;
  validate?: (record: T) => string | null;
  getRecordLabel?: (record: T) => string;
}

export function EntityCrudTable<T extends { id: string }>({
  title,
  description,
  records,
  columns,
  fields,
  emptyMessage = "No records yet.",
  searchKeys,
  searchPlaceholder = "Search…",
  onSave,
  onDelete,
  createRecord,
  validate,
  getRecordLabel,
}: EntityCrudTableProps<T>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchKeys?.length) return records;
    const q = query.toLowerCase();
    return records.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
    );
  }, [records, query, searchKeys]);

  const openNew = () => {
    setDraft(createRecord());
    setError(null);
    setOpen(true);
  };

  const openEdit = (record: T) => {
    setDraft({ ...record });
    setError(null);
    setOpen(true);
  };

  const handleSave = () => {
    if (!draft) return;
    const err = validate?.(draft);
    if (err) {
      setError(err);
      return;
    }
    onSave(draft);
    setOpen(false);
    setDraft(null);
  };

  const setField = (key: keyof T, value: unknown) => {
    if (!draft) return;
    setDraft({ ...draft, [key]: value });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-soft overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-extrabold tracking-wide uppercase">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {searchKeys && searchKeys.length > 0 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-40 pl-8 text-xs"
              />
            </div>
          )}
          <Button size="sm" onClick={openNew} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8">
          <Empty>
            <EmptyTitle>{records.length === 0 ? emptyMessage : "No matches for your search."}</EmptyTitle>
          </Empty>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-24 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/10">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 font-medium">
                      {col.format
                        ? col.format(row[col.key], row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)} aria-label="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteTarget(row)}
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {draft?.id && records.some((r) => r.id === draft.id) ? "Edit" : "Add"} {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {fields.map((field) => (
              <div key={String(field.key)} className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {field.label}
                  {field.required && " *"}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={String(draft?.[field.key] ?? "")}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" && field.options ? (
                  <Select
                    value={String(draft?.[field.key] ?? "")}
                    onValueChange={(v) => setField(field.key, v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder ?? "Select…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type === "currency" || field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    step={field.type === "currency" ? 100 : field.step}
                    min={field.type === "currency" || field.type === "number" ? 0 : undefined}
                    value={draft?.[field.key] === 0 || draft?.[field.key] ? String(draft[field.key]) : ""}
                    onChange={(e) =>
                      setField(
                        field.key,
                        field.type === "number" || field.type === "currency"
                          ? Number(e.target.value)
                          : e.target.value,
                      )
                    }
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove "${getRecordLabel?.(deleteTarget) ?? "this item"}" from your local data.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function formatMoneyCell(value: unknown): string {
  const n = Number(value);
  return Number.isFinite(n) ? formatCurrency(n) : "—";
}
