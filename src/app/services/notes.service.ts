import { computed, effect, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  private notes = signal<Note[]>([]);
  searchQuery = signal('');
  selectedCategory = signal('all');

  filteredNotes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    let filtered = this.notes();

    if (category !== 'all') {
      filtered = filtered.filter((n) => n.category === category);
    }

    if (query) {
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });

  categories = computed(() => {
    const cats = new Set(this.notes().map((n) => n.category));
    return Array.from(cats).sort();
  });

  constructor(private storage: StorageService) {
    this.notes.set(this.storage.get('fh_notes_v2', []));
    effect(() => {
      this.storage.set('fh_notes_v2', this.notes());
    });
  }

  addNote(title: string, content: string, category: string): void {
    const note: Note = {
      id: Date.now().toString(),
      title,
      content,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.update((notes) => [note, ...notes]);
  }

  updateNote(id: string, title: string, content: string, category: string): void {
    this.notes.update((notes) =>
      notes.map((n) =>
        n.id === id ? { ...n, title, content, category, updatedAt: new Date().toISOString() } : n
      )
    );
  }

  deleteNote(id: string): void {
    this.notes.update((notes) => notes.filter((n) => n.id !== id));
  }

  getNoteById(id: string): Note | undefined {
    return this.notes().find((n) => n.id === id);
  }
}
