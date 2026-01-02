import { effect, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class NotesService {
  content = signal('');

  constructor(private storage: StorageService) {
    this.content.set(this.storage.get('fh_notes', ''));
    effect(() => {
      this.storage.set('fh_notes', this.content());
    });
  }
}
