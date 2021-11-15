import { Dictionary } from '@app/classes/dictionary';

describe('dictionary', () => {
    let dictionary: Dictionary;

    beforeEach(() => {
        dictionary = new Dictionary('title', 'description');
    });

    it('should be created', () => {
        expect(dictionary).toBeTruthy();
    });
});
