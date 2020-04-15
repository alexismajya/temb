var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material';
import { ProviderService } from '../../../__services__/providers.service';
var ProviderSelectorComponent = /** @class */ (function () {
    function ProviderSelectorComponent(mediaObserver, providerService) {
        var _this = this;
        this.mediaObserver = mediaObserver;
        this.providerService = providerService;
        this.cols = 3;
        this.rowHeight = '3:1';
        this.colspan = 1;
        this.disableOtherInput = false;
        this.providers = [];
        this.activeMediaQuery = '';
        this.emitAutoComplete = new EventEmitter();
        this.clickedProviders = new EventEmitter();
        this.invalidProviderClicked = new EventEmitter();
        this.keyWordFilter = function (value) {
            if (value.providerName === '') {
                _this.disableOtherInput = false;
            }
            if (value.providerName) {
                var provider = _this.providers.filter(function (p) {
                    return p.name === value.providerName;
                })[0];
                if (!provider) {
                    _this.invalidProviderClicked.emit();
                }
                return _this._filter(value.providerName);
            }
            return _this.providers;
        };
        this.sort = 'name,asc,batch,asc';
        this.watcher = mediaObserver['media$'].subscribe(function (change) {
            _this.activeMediaQuery = change ? "'" + change.mqAlias + "' = (" + change.mediaQuery + ")" : '';
            switch (change.mqAlias) {
                case 'xs':
                    _this.setValues(2, '5:1', 2);
                    break;
                case 'sm':
                    _this.setValues(3, '3:1', 1);
                    break;
            }
        });
    }
    ProviderSelectorComponent.prototype.ngOnInit = function () {
        this.getProvidersInventory();
        this.emitAutoComplete.emit(this.auto);
    };
    ProviderSelectorComponent.prototype.startFiltering = function () {
        if (this.approveForm.controls) {
            this.filteredOptions = this.approveForm.valueChanges
                .pipe(startWith(''), map(this.keyWordFilter));
        }
    };
    ProviderSelectorComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.providers.filter(function (option) {
            return option.name && option.name.toLowerCase().includes(filterValue);
        });
    };
    ProviderSelectorComponent.prototype.getProvidersInventory = function () {
        var _this = this;
        this.providerService.getViableProviders().subscribe(function (providersData) {
            _this.providers = providersData.data;
            _this.startFiltering();
        });
    };
    ProviderSelectorComponent.prototype.click = function (option) {
        this.clickedProviders.emit(option);
    };
    ProviderSelectorComponent.prototype.setOption = function (option) {
        return option[this.optionValue];
    };
    ProviderSelectorComponent.prototype.setValues = function (cols, rowHeight, colspan) {
        this.cols = cols;
        this.rowHeight = rowHeight;
        this.colspan = colspan;
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ProviderSelectorComponent.prototype, "approveForm", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ProviderSelectorComponent.prototype, "optionValue", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ProviderSelectorComponent.prototype, "emitAutoComplete", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ProviderSelectorComponent.prototype, "clickedProviders", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ProviderSelectorComponent.prototype, "invalidProviderClicked", void 0);
    __decorate([
        ViewChild('auto'),
        __metadata("design:type", MatAutocomplete)
    ], ProviderSelectorComponent.prototype, "auto", void 0);
    ProviderSelectorComponent = __decorate([
        Component({
            selector: 'app-select-provider',
            templateUrl: './provider-selector.component.html',
            styleUrls: ['./provider-selector.component.scss']
        }),
        __metadata("design:paramtypes", [MediaObserver,
            ProviderService])
    ], ProviderSelectorComponent);
    return ProviderSelectorComponent;
}());
export { ProviderSelectorComponent };
//# sourceMappingURL=provider-selector.component.js.map