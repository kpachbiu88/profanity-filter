import Censure from '../src/censure';

test('Replace all bad words', () => {
    const censure = new Censure();
    let input = 'Это пиздёж!';

    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Это ложь!');

    input = 'Я те говорил, она на всю башку пизданутая!';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Я те говорил, она на всю башку глупая!');

    input = 'Пиздатый фильм.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Хорошего качества фильм.');

    input = 'Пиздато говоришь.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Хорошо говоришь.');

    input = 'Как только услышит Таня слово ***, так начинает пизденеть.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Как только услышит Таня слово ***, так начинает балдеть.');

    input = 'Только если перестанет пиздеть.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Только если перестанет болтать чепуху.');

    input = 'Вы собираетесь отменить этот пиздецовый карнавал?';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Вы собираетесь отменить этот хороший карнавал?');

    input = 'Увижу вас еще раз — пиздец вам, ребята.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Увижу вас еще раз — конец вам, ребята.');

    input = 'Пиздоболивать могут часами.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Говаривать могут часами.');

    input = 'Хорош пиздоболить, пора за работу приниматься.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Хорош болтать, пора за работу приниматься.');

    input = 'С культурой в стране хуевато.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('С культурой в стране плоховато.');

    input = 'Но план был хуеватый.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Но план был плоховатый.');

    input = 'Хуёво греют батареи!';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Плохо греют батареи!');

    input = 'И человек он хуёвый, и поэт так себе.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('И человек он плохой, и поэт так себе.');

    input = 'Такая вот хуёвина приключилась.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Такая вот ерунда приключилась.');

    input = 'Какая забавная хуёвинка на днях произошла.';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Какая забавная неприятность на днях произошла.');

    input = 'Пока навели порядок, хуё-моё — и день прошёл!';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Пока навели порядок, то да сё — и день прошёл!');

    input = 'А вот хуеньки!';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('А вот нет!');

    input = 'Это что за хуета!';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Это что за халтура!');

    input = 'Ялдометр';
    expect(censure.isBad(input)).toBe(true);
    expect(censure.fix(input)).toBe('Мужской половой орган большого размера');

});