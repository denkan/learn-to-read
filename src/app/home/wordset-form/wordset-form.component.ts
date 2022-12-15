import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { genId } from 'src/shared/utils/misc.utils';
import { StoreService } from '../../../core/store.service';

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
    id: [''],
    title: ['', Validators.required],
    words: [[] as string[], minLengthArray(this.minWords)],
    delete: [false],
  });

  get isEditing() {
    const { id } = this.form.value || {};
    return !!id;
  }

  private trackEditIndex() {
    this.route.params
      .pipe(
        map((p) => p?.['id']),
        filter((id) => !!id),
        switchMap((id) =>
          this.store.wordSets$.pipe(
            map((wordSets) => wordSets.find((ws) => ws.id == id)!)
          )
        ),
        filter((ws) => !!ws)
      )
      .subscribe((editWordSet) => {
        this.form.patchValue(editWordSet);
      });
  }

  addWord(e: MatChipInputEvent) {
    const newWord = e.value?.trim()?.toLocaleLowerCase();
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
    const { id, title, words, delete: shouldDelete } = this.form.value || {};
    const isValid = title && words && words.length >= this.minWords;
    if (!isValid) {
      return;
    }
    const wordSets = [...this.store.data.wordSets];
    const newWordSet = { title, words, id: genId() };
    const index = wordSets.findIndex((ws) => ws.id === id);
    if (this.isEditing && !!id && index >= 0) {
      if (shouldDelete) {
        wordSets.splice(index, 1);
      } else {
        wordSets[index] = newWordSet;
      }
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
