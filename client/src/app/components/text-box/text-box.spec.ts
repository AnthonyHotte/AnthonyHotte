import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBoxComponent } from './text-box';

describe('TextBoxComponent', () => {
    let component: TextBoxComponent;
    let fixture: ComponentFixture<TextBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextBoxComponent],
            imports: [FormsModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
