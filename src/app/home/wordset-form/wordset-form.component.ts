import { Component } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { StoreService, WordSet } from '../../../core/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-wordset-form',
  templateUrl: './wordset-form.component.html',
  styleUrls: ['./wordset-form.component.scss'],
})
export class WordsetFormComponent {
  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.trackEditIndex();
  }

  readonly minWords = 2;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  readonly form = this.fb.group({
    index: [-1],
    title: ['', Validators.required],
    words: [[] as string[], minLengthArray(this.minWords)],
  });

  get isEditing() {
    const { index } = this.form.value || {};
    return index != null && index >= 0;
  }

  private trackEditIndex() {
    this.route.params
      .pipe(
        map((p) => p?.['index']),
        filter((x) => !!x && parseInt(x) >= 0),
        map((x) => parseInt(x)),
        switchMap((index) =>
          this.store.wordSets$.pipe(
            map((wordSets) => ({ ...wordSets[index], index }))
          )
        ),
        filter((x) => !!x)
      )
      .subscribe((editWordSet) => {
        this.form.patchValue(editWordSet);
      });
  }

  addWord(e: MatChipInputEvent) {
    const newWord = e.value?.trim();
    if (!!newWord) {
      const words = [...(this.form.value.words || [])];
      words.push(newWord);
      this.form.patchValue({ words });
      e.chipInput.clear();
    }
  }

  removeWord(word: string) {
    const words = (this.form.value.words || []).filter((x) => x !== word);
    this.form.patchValue({ words });
  }

  onSubmit() {
    const { index, title, words } = this.form.value || {};
    const isValid = title && words && words.length >= this.minWords;
    if (!isValid) {
      return;
    }
    const newWordSet = { title, words };
    const wordSets = [...this.store.data.wordSets];
    if (this.isEditing && index != null) {
      wordSets[index] = newWordSet;
    } else {
      wordSets.push(newWordSet);
    }
    this.store.patch({ wordSets });
    this.router.navigate(['../']);
  }
}

const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } | null => {
    if (c.value.length >= min) return null;

    return { MinLengthArray: true };
  };
};
