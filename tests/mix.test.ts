import Censure from '../src/censure';
import patterns_ru from '../src/patterns/patterns_ru';
import patterns_en from '../src/patterns/patterns_en';

test('Mix bad words', () => {
    const censure = new Censure();
    const testPatterns = [...patterns_ru, ...patterns_en];

    for (const p of testPatterns){
        let testEnding = '';
        let validWords: string[] = [];

        if (p.match("\\[а-я\\]\\+|\\[а-яё\\]\\+/iug")) {
            testEnding = 'ились';
            validWords = ['это','задница','слово','парк','табуретка','экран','шуфлядка'];
        } else if (p.match("\\[a-z\\]\\+|\\[A-Z\\]\\+/iug")){
            testEnding = 'es';
            validWords = ['feet','food','ice','sun','moon','zero','date'];
        }
        
        const replace = ', ';
        const testLine = p.replace(new RegExp('\\[а-я\\]\\+|\\[а-яё\\]\\+|\\[a-z\\]\\+|\\[A-Z\\]\\+', 'iug'), testEnding)
                          .replace(new RegExp('\\|', 'iug'), replace)
                          .replaceAll('^', '');

        const words = testLine.split(replace);
        const expectedArr: string[] = [];
        const testArr: string[] = [];

        for (let i = 0; i < words.length; i++) {
            if (i % 2 === 0) {
                testArr.push(validWords[i]);
                expectedArr.push(validWords[i]);
            }
            testArr.push(words[i]);
            expectedArr.push('***');
        }
        const test = testArr.join(" ");
        const expected = expectedArr.join(" ");
        
        // if (censure.replace(test) == ', ***') {
        if (censure.isBad(test) == false) {
            console.log(test)
            console.log(expected)
            console.log(censure.replace(test))
            console.log(censure.isBad(test))
        }

        expect(censure.isBad(test)).toBe(true);
        expect(censure.replace(test)).toBe(expected);
    }
});