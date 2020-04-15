import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IProviderToken } from '../../../shared/models/provider.model';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';

@Component({
  selector: 'app-provider-verify',
  templateUrl: './provider-verify.component.html',
  styleUrls: [
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss',
    './provider-verify.component.scss',
  ]
})

export class ProviderVerifyComponent implements OnInit {
  token: IProviderToken;
  loading = false;
  verified: boolean = null;
  constructor(
    private route: ActivatedRoute,
    public providerService: ProviderService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public alert: AlertService,
  ) {
    this.registerIcons();
   }
  ngOnInit() {
    this.token = this.route.snapshot.params.token;
    this.getPayload();
  }

  registerIcons = () => {
    const appIcon = [
      { name: 'combined-shape', url: 'assets/combined-shape.svg' },
    ];
    appIcon.forEach(item => {
      this.iconRegistry.addSvgIcon(item.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(item.url));
    });
  }

  logError(error) {
    if (error && error.status === 400) {
      const { error: { message } } = error;
      this.alert.error(message);
    }
  }

  getPayload = () => {
    this.loading = true;
    const data = { token: this.token};
    this.providerService.verify(data).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success(response.message);
          this.verified = true;
          this.loading = false;
        }
      },
      (error) => {
        this.logError(error);
        this.verified = false;
        this.loading = false;
      }
    );
  }
}
