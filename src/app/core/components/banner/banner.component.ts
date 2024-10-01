import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnChanges {
  @Input({ required: true }) bannerTitle = '';
  @Input({ required: true }) bannerOverview = '';
  @Input({ required: true }) bannerKey = 'r_pUE7OcN8w';

  private sanitizer = inject(DomSanitizer);
  videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube.com/embed/${this.bannerKey}?autoplay=1&mute=1&loop=1&controls=0`
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bannerKey']) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.bannerKey}?autoplay=1&mute=1&loop=1&controls=0`
      );
      console.log(this.videoUrl);
    }
  }
}
