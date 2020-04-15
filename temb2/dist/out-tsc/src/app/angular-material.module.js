var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MatExpansionModule, MatIconModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatDialogModule, MatCardModule, MatSelectModule, MatButtonModule, MatTabsModule, MatBadgeModule, MatGridListModule, MatOptionModule, MatAutocompleteModule, MatProgressBarModule, MatDatepickerModule, MatRadioModule, MatTooltipModule, MatTableModule, MatInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
var AngularMaterialModule = /** @class */ (function () {
    function AngularMaterialModule() {
    }
    AngularMaterialModule = __decorate([
        NgModule({
            imports: [
                FlexLayoutModule,
                MatToolbarModule,
                MatSidenavModule,
                MatIconModule,
                MatMenuModule,
                MatListModule,
                FlexLayoutModule,
                MatExpansionModule,
                MatDialogModule,
                MatCardModule,
                MatButtonModule,
                MatSelectModule,
                MatTabsModule,
                MatDatepickerModule,
                MatBadgeModule,
                MatOptionModule,
                MatGridListModule,
                MatAutocompleteModule,
                MatProgressBarModule,
                MatRadioModule,
                MatTooltipModule,
                MatTableModule,
                MatInputModule
            ],
            exports: [
                MatToolbarModule,
                MatSidenavModule,
                MatIconModule,
                MatMenuModule,
                MatListModule,
                FlexLayoutModule,
                MatDatepickerModule,
                MatExpansionModule,
                MatDialogModule,
                MatCardModule,
                MatSelectModule,
                MatButtonModule,
                MatOptionModule,
                MatTabsModule,
                MatBadgeModule,
                MatGridListModule,
                MatAutocompleteModule,
                MatProgressBarModule,
                MatRadioModule,
                MatTooltipModule,
                MatTableModule,
                MatInputModule
            ]
        })
    ], AngularMaterialModule);
    return AngularMaterialModule;
}());
export { AngularMaterialModule };
//# sourceMappingURL=angular-material.module.js.map