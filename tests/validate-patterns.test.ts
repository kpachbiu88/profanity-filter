import * as patterns from '../src/patterns'

const haveRegexRules = (pattern: string): boolean => {
  const symbolsRegex = /[.*+?^${}()|[\]\\]/ui
  return symbolsRegex.test(pattern)
}

const haveAlternate = (pattern: string): boolean => {
  const alternateRegex = /\|/ui;
  return alternateRegex.test(pattern)
}

const validateRules = (pattern: string): boolean => {
  const validRegex: RegExp[] = [
    /^\^[^\^\$\[\]\(\)\*\?\\]*$/ui, // ^abeed
    /^[^\^\$\[\]\(\)\*\?\\]*\$$/ui, // abeed$
    /^\^[^\^\$\[\]\(\)\*\?\\]*\$$/ui, // ^abeed$
    /^[^\^\$\[\]\(\)\*\?\\]*\[(a-z|a-zäöåš|а-я)\]\+$/ui, // abeed[a-z]+
    /^\^[^\^\$\[\]\(\)\*\?\\]*\[(a-z|a-zäöåš|а-я)\]\+$/ui, // ^abeed[a-z]+
  ]

  let result = false
  for (const r of validRegex) {
    if (r.test(pattern)) {
      result = true
      break
    }
  }
  return !result
}

describe('Validate Patterns Tests', () => {
  it('should patterns have only valid symbols', () => {
    expect(() => {
      for (const p of [...patterns.ru, ...patterns.en, ...patterns.fi]) {
        if (haveRegexRules(p)) { // string have regex rules
          if (haveAlternate(p)) { // rules with |
            const altPatterns = p.split('|')
            for (const ap of altPatterns) {
              if (haveRegexRules(ap)) {
                const res = validateRules(ap)
                if (res) {
                  throw Error(`In regex rule ${p} alternate regex rule ${ap} not valid`)
                }
              }
            }
          } else {
            const res = validateRules(p)
            if (res) {
              throw Error(`Regex rule ${p} not valid`)
            }
          }
        }
      }
    }).not.toThrow()
  });
});