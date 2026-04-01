import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DraggableModal } from './DraggableModal';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffset?: { x: number; y: number };
}

export function NotesModal({ isOpen, onClose, initialOffset }: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }
    setNotes([{ id: Date.now().toString(), title: newNote.title, content: newNote.content, createdAt: new Date() }, ...notes]);
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
    toast.success('Note added!');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} className="overflow-y-auto" initialOffset={initialOffset} minWidth={320} minHeight={340} style={{ width: 320, height: 340 }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold leading-none">Notes</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm" variant={isAdding ? 'outline' : 'default'}>
          <Plus className="w-4 h-4 mr-1" />Add Note
        </Button>
      </div>

      <div className="space-y-4 py-4">
        {isAdding && (
          <Card className="p-4 space-y-3 border-sidebar-border bg-card/80 backdrop-blur-sm">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              autoFocus
            />
            <Textarea
              placeholder="Write your note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddNote} className="flex-1">Save Note</Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
            </div>
          </Card>
        )}

        {notes.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No notes yet. Add your first note!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notes.map(note => (
              <Card key={note.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium">{note.title}</h3>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DraggableModal>
  );
}
