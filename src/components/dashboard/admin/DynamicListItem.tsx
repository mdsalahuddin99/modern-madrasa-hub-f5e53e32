import { useState, createContext, useContext, useCallback, ReactNode } from "react";
import { ArrowUp, ArrowDown, Trash2, Pencil, Check, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Drag Context ── */
interface DragCtx {
  dragIndex: number | null;
  overIndex: number | null;
  onDragStart: (i: number) => void;
  onDragOver: (i: number) => void;
  onDragEnd: () => void;
}
const DragContext = createContext<DragCtx | null>(null);

interface DynamicListItemProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canDelete?: boolean;
  renderView: () => React.ReactNode;
  renderEdit: () => React.ReactNode;
  onSave?: () => void;
}

const DynamicListItem = ({
  index, total, onMoveUp, onMoveDown, onDelete,
  canDelete = true, renderView, renderEdit, onSave,
}: DynamicListItemProps) => {
  const [editing, setEditing] = useState(false);
  const drag = useContext(DragContext);

  const isDragging = drag?.dragIndex === index;
  const isDragOver = drag?.overIndex === index;

  return (
    <div
      draggable={!editing && !!drag}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        drag?.onDragStart(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        drag?.onDragOver(index);
      }}
      onDrop={(e) => { e.preventDefault(); drag?.onDragEnd(); }}
      onDragEnd={() => drag?.onDragEnd()}
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        isDragging
          ? "opacity-40 scale-95 border-primary/50 bg-primary/5"
          : isDragOver
          ? "border-primary border-dashed bg-primary/10 shadow-md shadow-primary/10 scale-[1.01]"
          : "bg-muted/20 border-border/30"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border/20">
        <div className={`flex items-center gap-1 ${drag ? "cursor-grab active:cursor-grabbing" : ""} select-none`}>
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary transition-colors" />
          <span className="text-[10px] font-medium text-muted-foreground">#{index + 1}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveUp} disabled={index === 0} title="উপরে নিন">
            <ArrowUp className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveDown} disabled={index === total - 1} title="নিচে নিন">
            <ArrowDown className="w-3 h-3" />
          </Button>
          {editing ? (
            <>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => { onSave?.(); setEditing(false); }} title="সেভ">
                <Check className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditing(false)} title="বাতিল">
                <X className="w-3 h-3" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditing(true)} title="এডিট">
              <Pencil className="w-3 h-3" />
            </Button>
          )}
          {canDelete && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={onDelete} title="মুছুন">
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="p-3">{editing ? renderEdit() : renderView()}</div>
    </div>
  );
};

export default DynamicListItem;

/* ── Array helpers ── */
export const moveUp = <T,>(arr: T[], index: number): T[] => {
  if (index <= 0) return arr;
  const copy = [...arr];
  [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
  return copy;
};

export const moveDown = <T,>(arr: T[], index: number): T[] => {
  if (index >= arr.length - 1) return arr;
  const copy = [...arr];
  [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
  return copy;
};

export const reorder = <T,>(arr: T[], from: number, to: number): T[] => {
  if (from === to) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

/* ── Drag hook (still exported for non-wrapper usage) ── */
export const useDragReorder = <T,>(
  items: T[],
  onReorder: (newItems: T[]) => void
) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const onDragStart = useCallback((i: number) => { setDragIndex(i); setOverIndex(null); }, []);
  const onDragOver = useCallback((i: number) => { setOverIndex(i); }, []);
  const onDragEnd = useCallback(() => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(reorder(items, dragIndex, overIndex));
    }
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, items, onReorder]);

  return { dragIndex, overIndex, onDragStart, onDragOver, onDragEnd };
};

/* ── DraggableList Wrapper — auto-provides drag context ── */
export const DraggableList = <T,>({ items, onReorder, children }: {
  items: T[];
  onReorder: (newItems: T[]) => void;
  children: ReactNode;
}) => {
  const ctx = useDragReorder(items, onReorder);
  return (
    <DragContext.Provider value={ctx}>
      <div className="space-y-2">
        {children}
      </div>
    </DragContext.Provider>
  );
};
