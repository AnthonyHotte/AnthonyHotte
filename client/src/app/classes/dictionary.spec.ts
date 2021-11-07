import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';

describe('dictionary', () => {
    let dictionary: Dictionary;

    beforeEach(() => {
        dictionary = TestBed.inject(Dictionary);
    });

    it('should be created', () => {
        expect(dictionary).toBeTruthy();
    });
});
