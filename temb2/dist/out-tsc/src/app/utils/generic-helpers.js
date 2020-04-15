import { ConfirmModalComponent } from '../admin/confirmation-dialog/confirmation-dialog.component';
export var getDialogProps = function (displayText, confirmText, width, backdropClass, panelClass) {
    if (confirmText === void 0) { confirmText = 'Yes'; }
    if (width === void 0) { width = '592px'; }
    if (backdropClass === void 0) { backdropClass = 'modal-backdrop'; }
    if (panelClass === void 0) { panelClass = 'small-modal-panel-class'; }
    return {
        width: width,
        backdropClass: backdropClass,
        panelClass: panelClass,
        data: {
            confirmText: confirmText,
            displayText: displayText
        }
    };
};
export var openDialog = function (dialog, displayText) { return (dialog.open(ConfirmModalComponent, getDialogProps(displayText))); };
//# sourceMappingURL=generic-helpers.js.map