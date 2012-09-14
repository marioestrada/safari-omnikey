# Safari Omnibar-like keyword search

This extension provides implements a keyword search from Safari's url bar.

## Example

Searching for `amazon ipod touch` from the url bar will search for `ipod touch` directly in Amazon's website.

## Bundled Site Keywords

- Amazon: `amazon`
- Wikipedia: `wiki`
- Ebay: `ebay`
- Newegg: `newegg`
- Duckduckgo: `ddg`
- YouTube: `youtube`
- Rotten Tomatoes: `rt`
- Wolfram Alpha: `wolfram`
- Zappos: `zappos`
- Twitter: `twitter`

# Force Regular Search

You can force a regular search without keyword matching by prepending the query with a `!`, eg: `!amazon headquarters`.

# To-do

- __(done)__ <strike>Site manager (Settings)</strike>
- __(done)__ <strike>Bang search forcing regular search</strike>
- __(done)__ <strike>Look for a faster way to detect searches and prevent Google flashing before some searches<strike>
- Being able to set a default search site for all searches.

# Version History

### 0.10

- [Improvement] Omnikey used to work in a hacky kind of way, now it listens for the `beforeSearch` event which makes it way more faster and prevents the rare Google screen flicker.

### 0.9.1

- [Bugfix] Taking into account localized versions of Safari that perform searches on different domains, this fixes issues that prevented Omnikey from doing it's magic when running in other languages (thanks to Lukas Herman for reporting).

### 0.9

- First release