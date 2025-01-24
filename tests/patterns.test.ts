import ProfanityFilter from '../src';
import * as patterns from '../src/patterns'

jest.mock('../src/patterns', () => ({
  en: ["ass", "^bitch", "shit$", "^cock$", "dick[a-z]+", "^bastard[a-z]+"],
  fi: ["^kusi[a-zäöåš]+"],
  ru: ["^хуй[а-я]+"]
}));

describe('Pattern Tests', () => {
  it.each([
    {
      regex: 'ass',
      text: "This is different variants ass, asset, compass, passed",
      expected: "This is different variants ***, ***, ***, ***",
    },
    {
      regex: '^bitch',
      text: "This is different variants bitch, bitches, unbitch, unbitches",
      expected: "This is different variants ***, ***, unbitch, unbitches",
    },
    {
      regex: 'shit$',
      text: "This is different variants shit, shited, unshit, unshited",
      expected: "This is different variants ***, shited, ***, unshited",
    },
    {
      regex: '^cock$',
      text: "This is different variants cock, cockes, uncock, uncockes",
      expected: "This is different variants ***, cockes, uncock, uncockes",
    },
    {
      regex: 'dick\\p{L}+',
      text: "This is different variants dick, dicks, undick, undicks",
      expected: "This is different variants dick, ***, undick, ***",
    },
    {
      regex: '^bastard\\p{L}+',
      text: "This is different variants bastard, bastardes, unbastard, unbastardes",
      expected: "This is different variants bastard, ***, unbastard, unbastardes",
    },
  ])(
    "should handle rule $regex",
    ({ text, expected }) => {
      const filter = new ProfanityFilter();

      expect(filter.isBad(text)).toBe(true);
      expect(filter.replace(text)).toBe(expected);
    }
  );

  it('should patterns handle words with Latin modified letters (like ä,ö etc..)', () => {
    const filter = new ProfanityFilter({
      languages: ['en', 'fi']
    });
    expect(filter.isBad('This is finnish kusipää')).toBe(true);
    expect(filter.replace('This is finnish kusipää')).toBe('This is finnish ***');
  });

  it('should patterns handle words with Cyrillic modified letters (like ä,ö etc..)', () => {
    const filter = new ProfanityFilter({
      languages: ['ru']
    });
    expect(filter.isBad('This is russian хуйло')).toBe(true);
    expect(filter.replace('This is russian хуйло')).toBe('This is russian ***');
  });
});