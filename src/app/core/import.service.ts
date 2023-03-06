import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService, WordSet } from './store.service';

@Injectable({ providedIn: 'root' })
export class ImportService {
  constructor(private store: StoreService, private router: Router) {}

  importWordsetsFromJson(jsonAsBase64?: string) {
    if (!jsonAsBase64) {
      return;
    }
    const json = window.atob(jsonAsBase64);
    const wordsetArrOrObj = JSON.parse(json);
    const currWordSets = this.store.data.wordSets;
    const appendWordSets = Array.isArray(wordsetArrOrObj)
      ? wordsetArrOrObj
      : [wordsetArrOrObj];
    const newWordSets = [...currWordSets];
    for (const ws of appendWordSets) {
      const isValid = ws?.id && ws?.title && ws?.words?.length >= 2;
      const alreadyExists = currWordSets.some((x) => x.id === ws.id);
      if (isValid && !alreadyExists) {
        newWordSets.push(ws);
      }
    }
    this.store.patch({ wordSets: newWordSets });
  }

  getWordsetsImportUrl(wordsets: WordSet[]) {
    const json = JSON.stringify(wordsets);
    const jsonAsBase64 = window.btoa(json);
    const url = new URL(window.location.origin);
    url.searchParams.append('in', jsonAsBase64);
    return url.toString();
  }
}
