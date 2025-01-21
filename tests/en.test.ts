import Censure from '../src/censure';
import patterns_en from '../src/patterns/patterns_en';



test('English bad words', () => {
    const censure = new Censure();
    const testPatterns = patterns_en;

    for (const p of testPatterns){
        const testEnding = 'es';
        const replace = ', ';
        const a = p.replace(new RegExp('\\[a-z\\]\\+|\\[A-Z\\]\\+', 'iug'), testEnding);
        const testLine = a.replace(new RegExp('\\|', 'iug'), replace);
        const words = testLine.split(replace);
        const expectedArr: string[] = [];

        for (let a = 0; a < words.length; a++) {
            expectedArr.push('***');
        }

        const expected = expectedArr.join(" ");

        expect(censure.isBad(testLine)).toBe(true);
        expect(censure.replace(testLine)).toBe(expected);
    }
});