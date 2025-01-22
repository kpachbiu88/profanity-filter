import { patternsRu, patternsEn, replacePatternsRu } from './patterns/index';

// TODO: Add and remove patterns
// TODO: add patterns tests: pattern don't have any symbols except "letters, numbers, ^, $, [a-z]+ , -"
// TODO: add labels pictures to README.md
// TODO: add finnish language patterns
// TODO: add another languages 
// TODO: add language detection
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
   * @type {string}
   */
  placeholder: string = '***'

  /**
   * Array of supported languages.
   * @type {string[]}
   */
  languages: string[] = ['ru', 'en']

  /**
   * In debug mode you can see original word and find out which pattern caused the trigger.
   * @type {boolean}
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
   * Searches if there are any abusive words in the text.
   * @param {string} string - Original text.
   * @return {boolean} - Returns true if there are any abusive words in the string, otherwise false.
   */
  public isBad(string: string): boolean {
    const words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
      const wordParts = this.getCleanedWords(words[i])
      
      for (const w of wordParts) {
        if (w.length < 3) continue;
        const match = this.search(w)
        if (match) {
          return true
        }
      }
    }
    return false
  }

  /**
   * Replaces abusive words in the string.
   * @param {string} string - Original text.
   * @return {string} - Cleaned text with abusive words replaced.
   */
  public replace(string: string): string {
    const words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
      const wordParts = this.getCleanedWords(words[i])
      
      for (const w of wordParts) {
        if (w.length < 3) continue;
        const match = this.search(w)
        if (match) {
          words[i] = words[i].replaceAll(match[0], this.placeholder);
        }
      }
    }
    return words.join(' ');
  }

  /**
   * Cleans the input string by removing non-alphabetic characters and splitting into words.
   * @param {string} string - Original text.
   * @return {string[]} - Array of cleaned words.
   */
  private getCleanedWords(string: string): string[] {
    const wordWithoutSymbols = string.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, ' ').trim();
    return wordWithoutSymbols.split(/\s+/g);
  }

  /**
   * Fixes abusive words inside the string.
   * @param {string} string - Original text.
   * @return {string} - Fixed text with abusive words corrected.
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
   * Changes the filter options.
   * @param {FilterOptions} opts - Options to configure the filter.
   */
  public setOptions(opts: FilterOptions): void {
    Object.assign(this, opts)
  }

  /**
   * Searches for an abusive word in the given word.
   * @param {string} word - Original word.
   * @return {RegExpExecArray | null} - Returns the match if found, otherwise null.
   */
  private search(word: string): RegExpExecArray | null {
    const patterns = this.getPatterns(word);
    const firstLetter = word.charAt(0).toLowerCase();
    const filteredPatterns = patterns.filter(p => p.replace('^', '').charAt(0).toLowerCase() === firstLetter);
    
    for (const p of filteredPatterns) {
      const regexp = this.prepare(p);
      const match = regexp.exec(word);
      if (match) {
        if (match && this.debug) console.debug(`DEBUG: ${word} ${p}`)
        return match
      }
    }
    return null
  }

  /**
   * Prepares a regular expression pattern.
   * @param {string} pattern - Pattern to prepare.
   * @return {RegExp} - Prepared regular expression.
   */
  private prepare(pattern: string): RegExp {
    return new RegExp(pattern, 'ui');
  }

  /**
   * Gets the patterns for the given string based on the supported languages.
   * @param {string} string - Original text.
   * @return {string[]} - Array of patterns.
   */
  private getPatterns(string: string): string[] {
    if (this.languages.includes('ru') && /[а-я]+/ui.test(string)) {
      return patternsRu;
    } else if (this.languages.includes('en') && /[a-z]+/.test(string)) {
      return patternsEn;
    } else {
      return [];
    }
  }

  /**
   * Checks if the first character of the string is uppercase.
   * @param {string} string - Original text.
   * @return {boolean} - Returns true if the first character is uppercase, otherwise false.
   */
  private checkFirstChar(string: string): boolean {
    const first = string.substring(0, 1);
    return (first.toLowerCase() !== first);
  }

  /**
   * Capitalizes the first character of the string.
   * @param {string} string - Original text.
   * @return {string} - Text with the first character capitalized.
   */
  private upFirstChar(string: string): string {
    const words = string.split(' ');
    words[0] = words[0].slice(0, 1).toUpperCase() + words[0].slice(1);

    return words.join(' ');
  }
}

export default ProfanityFilter
