import { patternsRu, patternsEn, replacePatternsRu } from './patterns/index';

//TODO: fix problem with this!fuck ass,fuck,cock and fuck\n\rsuck (with newline)
//
//TODO: Add and remove patterns
// TODO:  add patterns tests: pattern don't have any symbols except "letters, numbers, ^, $, [a-z]+ , -"
// TODO: add labels pictures to README.md
// TODO: add finnish language patterns
//TODO: add another languages 
//TOOD: add language detection
// https://code.luasoftware.com/tutorials/nodejs/javascript-regexp-for-language-detection
// https://code.luasoftware.com/tutorials/nodejs/javascript-detect-language-of-string

//TODO: add another languages https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words?tab=readme-ov-file

export interface FilterOptions {
  placeholder?: string
  languages?: ('ru'|'en')[]
  debug?: boolean
}

class ProfanityFilter {
  /**
   * Character used to replace profane words.
   * @type {string} placeHolder - Character used to replace profane words.
   */
  placeholder: string = '***'

  /**
   * Array of supported languages.
   * @type {string[]} languages - Array of supported languages.
   */
  languages: string[] = ['ru', 'en']

  /**
   * In debug mode you can see original word and find out which pattern caused the trigger
   * @type {boolean} placeHolder - Character used to replace profane words.
   */
  debug: boolean = false
  

  constructor(opts: FilterOptions = {}) {
    Object.assign(this, {
      placeholder: opts.placeholder || '***',
      languages: ['ru', 'en'],
      debug: opts.debug || false,
    })
  }

  /**
   * Searches if there any abusive words in the text
   *
   * @param {String} string - original text
   * @return {Boolean} - is there any abusive words in our string
   */
  public isBad(string: string): boolean {
    const patterns = this.getPatterns(string);
    for (const p of patterns) {
      let regexp = this.prepare(p.replace('^|\$', ''));
      if (regexp.test(string)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Replace abusive words from string
   *
   * @param {String} string - original text	 
   * @return {String} - cleaned text
   */
  public replace(string: string): string {
    const words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
      //const wordWithSymbols = words[i].replace(/[\/\\!?,.“”'"\n\r]/g, ' ').trim();
      const wordWithSymbols = words[i].replace(/[^a-zA-Zа-яА-ЯёЁ]/g, ' ').trim();
      const wordParts = wordWithSymbols.split(/\s+/g);

      // if (words[i].includes('fuck')) {
      //   console.log('TEST', words[i], wordParts)
      // }
      
      words[i] = this.filter(words[i], wordParts);
    }
    return words.join(' ');
  }

  /**
   * Fixing abusive words inside string
   * 
   * @param {String} string - original text	 
   * @return {String} - fixed text
   */
  public fix(string: string): string {
    let result: string = '';
    const patternKeys = Object.keys(replacePatternsRu).reverse()

    for (const p of patternKeys) {
      const pattern = this.prepare(p);
      const replace = replacePatternsRu[p];
      if (pattern.test(string)) {
        result = string.replace(pattern, replace)

        if (this.checkFirstChar(string)) {
          result = this.upFirstChar(result);
        }
      }
    }
    return result;
  }

  /**
   * Change options
   * @param opts 
   */
  public setOptions(opts: FilterOptions): void {
    Object.assign(this, opts)
  }

  /**
   * Search and replace abusive word
   * @param word 
   */
  private filter(originalWord: string, wordParts: string[]): string {
    for (const w of wordParts) {
      if (w.length < 3) continue;

      const patterns = this.getPatterns(w);
      const firstLetter = w.charAt(0).toLowerCase();
      const filteredPatterns = patterns.filter(p => p.replace('^', '').charAt(0).toLowerCase() === firstLetter);

      for (const p of filteredPatterns) {
        const regexp = this.prepare(p);
        const match = regexp.exec(w);
        if (match) {
          originalWord = originalWord.replaceAll(match[0], this.placeholder);
          if (this.debug) console.log(`DEBUG: ${w} ${p}`)
        }
      }
    }
    return originalWord;
  }

  private prepare(pattern: string): RegExp {
    return new RegExp(pattern, 'ui');
  }

  private getPatterns(string: string): string[] {
    if (this.languages.includes('ru') && /[а-я]+/ui.test(string)) {
      return patternsRu;
    } else if (this.languages.includes('en') && /[a-z]+/.test(string)) {
      return patternsEn;
    } else {
      return [];
    }
  }

  private checkFirstChar(string: string): boolean {
    const first = string.substring(0, 1);
    return (first.toLowerCase() !== first);
  }

  private upFirstChar(string: string): string {
    const words = string.split(' ');

    words[0] = words[0].slice(0, 1).toUpperCase() + words[0].slice(1);

    return words.join(' ');
  }
}

export default ProfanityFilter
