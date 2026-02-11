# ng gallery component

## Die ng- -gallery bildet einen Imageslider ab. Bilder können für eine links-rechts-Pfeil-Navigation gesteuert werden. Der Slider lässt sich über einen `close`Button schließen. Es können beliebig viele Bilder in den Slider eingebunden werden.

## Der HTML-Teil zur Steuerung der Navigation sieht wie folgt aus:

```typescript
@Component({
  selector: 'gallery-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./gallery-nav.scss'],
  template: `
    <i *ngIf="config.loop || state.hasPrev"
       class="g-nav-prev"
       aria-label="Previous"
       role="button"
       (click)="gallery.ref(this.id).prev(config.scrollBehavior)"
       [innerHtml]="navIcon"></i>

    <i *ngIf="config.loop || state.hasNext"
       class="g-nav-next"
       aria-label="Next"
       role="button"
       (click)="gallery.ref(this.id).next(config.scrollBehavior)"
       [innerHtml]="navIcon"></i>
  `,
  standalone: true,
  imports: [CommonModule]
})
```

**Problem nach den Regeln der Barrierefreiheit:**

Hier ist keine Tastatur-Steuerung implementiert, da die Pfeile nicht fokussierbar sind. Es könnte jedoch eine Tastatursteuerung implementiert werden, indem die Pfeile fokussierbar gemacht und entsprechende Tastaturereignisse hinzugefügt werden.

- statt `<i role="button">` echte `<button>`: automatisch fokussierbar + Enter/Space funktionieren
- aria-label bleibt auf dem Button, Icon ist aria-hidden
- disabled verhindert Interaktion auch funktional (nicht nur optisch)

```typescript
@Component({
  selector: 'gallery-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./gallery-nav.scss'],
  template: `
    <button
      *ngIf="config.loop || state.hasPrev"
      type="button"
      class="g-nav-prev"
      (click)="onPrev()"
      [disabled]="!config.loop && !state.hasPrev"
      aria-label="Previous"
    >
      <span class="g-nav-icon" [innerHTML]="navIcon" aria-hidden="true"></span>
    </button>

    <button
      *ngIf="config.loop || state.hasNext"
      type="button"
      class="g-nav-next"
      (click)="onNext()"
      [disabled]="!config.loop && !state.hasNext"
      aria-label="Next"
    >
      <span class="g-nav-icon" [innerHTML]="navIcon" aria-hidden="true"></span>
    </button>
  `,
  standalone: true,
  imports: [CommonModule],
})
```

**Anpassung der Methoden in der Component-Klasse:**

```typescript
export class GalleryNavComponent {
    // bestehender Code bleibt unverändert

    onPrev(): void {
        if (!this.config.loop && !this.state.hasPrev) return
        this.gallery.ref(this.id).prev(this.config.scrollBehavior)
    }

    onNext(): void {
        if (!this.config.loop && !this.state.hasNext) return
        this.gallery.ref(this.id).next(this.config.scrollBehavior)
    }
}
```

**Button Reset in SCSS:**

```css
/* Button-Reset */
.g-nav-prev,
.g-nav-next {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
}

.g-nav-prev:disabled,
.g-nav-next:disabled {
    cursor: default;
    pointer-events: none;
}
```
