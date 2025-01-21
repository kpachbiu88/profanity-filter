# profanity-filter

This Regex based TypeScript library provides robust and customizable filtering of swear words and offensive language from text. 

## Features

**Multiple filtering rules**:** Regular expression-based filtering for highly flexible control.

**Customizable word lists:** Easily add, remove, or modify swear words to tailor the filter to your specific needs and context. Support for multiple languages is easily implemented by adding language-specific word lists.

**Contextual awareness:** Employ advanced techniques to reduce false positives by considering word context (e.g., "ass" in "assassin" would not be flagged). This feature may require additional configuration or external dependencies.

**Performance optimization:** Designed for efficiency, minimizing impact on application performance, even with large word lists.

**Easy integration:** Clean, well-documented API for seamless integration into any TypeScript project.

## Support languages

English, Russian

## Contribution
We are actively seeking new contributors to help expand and refine our filtering rules. 
Whether you have ideas for new regex patterns, improvements to existing ones, or support for additional languages, your contributions are welcome. 
Join us in making this library more robust and versatile for everyone.

### Regex rules support:

| Regex rule |  ass   |  asset  |  compass  |  passed  |
|:-----------|:------:|:-------:|:---------:|:--------:|
| ass        |   ✅  |    ✅   |     ✅    |    ✅   |
| ^ass       |   ✅  |    ✅   |     ❌    |    ❌   |
| ass$       |   ✅  |    ❌   |     ✅    |    ❌   |
| ^ass$      |   ✅  |    ❌   |     ❌    |    ❌   |
| ass[a-z]+  |   ❌  |    ✅   |     ❌    |    ✅   |
| ^ass[a-z]+ |   ❌  |    ✅   |     ❌    |    ❌   |

Please, combine rules to increase speed:

``^ass$|^asshole$``

## Get started

```sh
npm i profanity-filter
```

### Installation

```js
// Using Node.js `require()`
const profanityFilter = require('profanity-filter');

// Using ES6 imports
import profanityFilter from 'profanity-filter';
```

### Usage

```js
const censor = new Censure({
  placeholder: "***",
  languages: ['ru'|'en'],
  debug: false
});

```

### Functions

```js
// Check if there any swear words in the text
profanityFilter.isBad('Original message with swear words'); 
// return: true

// Replace swear words from string
profanityFilter.replace('Original message with swear words'); 
// return: string (cleaned text)

// Fixing swear words inside string
profanityFilter.fix('Original message with swear words'); 
// return: string (fixed text)
```
