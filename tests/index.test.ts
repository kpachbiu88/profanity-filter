import ProfanityFilter from '../src';
import * as allPatterns from '../src/patterns';

jest.mock('../src/patterns', () => ({
  en: ["^fuck", "shit$", "^bitch$"],
  fi: ["^vittu$"],
  ru: ["^ебать"]
}));

describe('ProfanityFilter', () => {
  let filter: ProfanityFilter;
  const badWord = 'fuck';

  beforeEach(() => {
    filter = new ProfanityFilter();
  });

  describe('Core public methods', () => {
    it('should detect bad words', () => {
      expect(filter.isBad(`This is a ${badWord}`)).toBe(true);
      expect(filter.isBad('This is a clean sentence')).toBe(false);
    });

    it('should replace bad words with placeholder', () => {
      expect(filter.replace(`This is a ${badWord}`)).toBe('This is a ***');
      expect(filter.replace('This is a clean sentence')).toBe('This is a clean sentence');
    });

    it('should fix bad words', () => {
      expect(filter.fix('ебать')).toBe('иметь интимную близость');
    });

    it('should set options correctly', () => {
      filter.setOptions({ placeholder: '###', debug: true });
      expect(filter.placeholder).toBe('###');
      expect(filter.debug).toBe(true);
    });
  });

  it('should handle different languages', () => {
    filter.setOptions({ languages: ['ru'] });
    expect(filter.isBad('ебать')).toBe(true);
    expect(filter.isBad('Предложение без мата')).toBe(false);
  });

  it('should handle mixed language input', () => {
    filter.setOptions({ languages: ['ru', 'en', 'fi'] });
    expect(filter.isBad(`Плохие слова: "${badWord}" and in finnish "vittu"`)).toBe(true);
    expect(filter.replace(`Плохие слова: "${badWord}" and in finnish "vittu"`)).toBe('Плохие слова: "***" and in finnish "***"');
  });

  it('should not detect bad words in clean input', () => {
    expect(filter.isBad('This is a clean input')).toBe(false);
  });

  it('should replace multiple bad words', () => {
    expect(filter.replace(`${badWord} and bitch`)).toBe('*** and ***');
  });

  it('should not replace parts of words', () => {
    expect(filter.replace('This is a badwording example')).toBe('This is a badwording example');
  });

  it('should handle empty input', () => {
    expect(filter.isBad('')).toBe(false);
    expect(filter.replace('')).toBe('');
  });

  it('should not handle word with < 3 letter', () => {
    expect(filter.isBad('fu')).toBe(false);
    expect(filter.replace('fu')).toBe('fu');
  });

  it('should handle input with non-letter symbols', () => {
    expect(filter.isBad(`The sentence with words ${badWord},
      and @${badWord}?`)).toBe(true);
    expect(filter.replace(`The sentence with words ${badWord},
      and @${badWord}?`)).toBe(`The sentence with words ***,
      and @***?`);
  });

  it('should handle input with non-letter symbols and replace only same word', () => {
    const text = `The sentence with words no${badWord}word,
      and @${badWord}?`
    const expected = `The sentence with words nofuckword,
      and @***?`
    expect(filter.isBad(text)).toBe(true);
    expect(filter.replace(text)).toBe(expected);
  });

  describe('Alphabet detection', () => {
    it('should return patterns for Russian language', () => {
      filter.setOptions({ languages: ['ru'] });
      const patterns = (filter as any).getPatterns('ебать');
      expect(patterns).toEqual(expect.arrayContaining(allPatterns.ru));
    });

    it('should return patterns for English language', () => {
      filter.setOptions({ languages: ['en'] });
      const patterns = (filter as any).getPatterns('fuck');
      expect(patterns).toEqual(expect.arrayContaining(allPatterns.en));
    });

    it('should return patterns for Finnish language', () => {
      filter.setOptions({ languages: ['fi'] });
      const patterns = (filter as any).getPatterns('vittu');
      expect(patterns).toEqual(expect.arrayContaining(allPatterns.fi));
    });

    it('should return combined patterns for multiple languages', () => {
      filter.setOptions({ languages: ['en', 'fi'] });
      const patterns = (filter as any).getPatterns('fuck');
      expect(patterns).toEqual(expect.arrayContaining([...allPatterns.en, ...allPatterns.fi]));
    });

    it('should return empty patterns for unsupported language', () => {
      filter.setOptions({ languages: ['ru'] });
      const patterns = (filter as any).getPatterns('hello');
      expect(patterns).toEqual([]);
    });
  });

});