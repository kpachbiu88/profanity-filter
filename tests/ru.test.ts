import Censure from '../src/censure';
import patterns_ru from '../src/patterns/patterns_ru';

test('Russian bad words', () => {
    const censure = new Censure();
    const testPatterns = patterns_ru;

    for (const p of testPatterns){
        const testEnding = 'ились';
        const replace = ', ';
        const testLine = p.replace(new RegExp('\\[а-я\\]\\+|\\[а-яё\\]\\+', 'iug'), testEnding)
        .replace(new RegExp('\\|', 'iug'), replace)
        .replaceAll('^', '');
        const words = testLine.split(replace);
        const expectedArr: string[] = [];

        for (let i = 0; i < words.length; i++) {
            expectedArr.push('***');
        }

        const expected = expectedArr.join(" ");

        expect(censure.isBad(testLine)).toBe(true);
        expect(censure.replace(testLine)).toBe(expected);
    }
});