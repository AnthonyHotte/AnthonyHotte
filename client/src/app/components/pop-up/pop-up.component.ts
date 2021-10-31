// taken from : https://careydevelopment.us/blog/how-to-create-confirmation-dialog-popups-using-angular-material
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpData } from '@app/classes/pop-up-data';

@Component({
    selector: 'app-pop-up',
    templateUrl: './pop-up.component.html',
    styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent {
    title: string;
    message: string;

    constructor(public dialogRef: MatDialogRef<PopUpComponent>, @Inject(MAT_DIALOG_DATA) public data: PopUpData) {
        this.title = 'Impossibilité de rejoindre la salle';
        this.message = 'La salle que vous essayez de rejoindre est occupée!';
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
