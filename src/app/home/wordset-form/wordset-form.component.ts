import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, filter, map, switchMap } from 'rxjs';
import { ImportService } from 'src/app/core/import.service';
import { StoreService, WordSet } from '../../core/store.service';
import { genId } from '../../shared/utils/misc.utils';

@Component({
  selector: 'app-wordset-form',
  templateUrl: './wordset-form.component.html',
  styleUrls: ['./wordset-form.component.scss'],
})
export class WordsetFormComponent {
  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private importService: ImportService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private translate: TranslateService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
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

  readonly shareUrl$ = this.form.valueChanges.pipe(
    map((fv) => {
      const isValid = !!(fv.id && this.form.valid);
      const ws = { ...fv };
      delete ws.delete;
      return isValid
        ? this.importService.getWordsetsImportUrl([ws as WordSet])
        : undefined;
    })
  );

  get isEditing() {
    const { id } = this.form.value || {};
    return !!id;
  }

  private trackEditIndex() {
    this.route.params
      .pipe(
        debounceTime(1), // let other obs subscribe before this runs
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

  copyShareUrl(url: string) {
    this.clipboard.copy(url);
    const copyText = this.translate.instant('WORDSETFORM.LABELS.COPIEDSHARE');
    const sb = this.snackbar.open(copyText);
    setTimeout(() => sb.dismiss(), 1000);
  }
}

const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } | null => {
    if (c.value.length >= min) return null;

    return { MinLengthArray: true };
  };
};
