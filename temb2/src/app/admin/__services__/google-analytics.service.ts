import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare let ga: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  trackingId: string;
  constructor() {
    this.trackingId = environment.googleAnalyticsId;
  }

  init() {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.google-analytics.com/analytics.js';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', '${this.trackingId}', 'auto');
    `;
    document.head.appendChild(script2);
  }

  sendPageView(url: string): void {
    ga('set', 'page', url);
    ga('send', 'pageview');
  }

  sendEvent(category: string, action: string): void {
    ga('send', 'event', category, action);
  }
}
