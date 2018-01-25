# Omnibar-like keyword search

This extension provides implements a keyword search from Safari's url bar.

## Example

Searching for `amazon ipod touch` from the url bar will search for `ipod touch` directly in Amazon's website.

## Bundled Site Keywords

- Amazon: `amazon`
- Amazon MP3: `mp3`
- Wikipedia: `wiki`
- Ebay: `ebay`
- Google Maps: `maps`
- Newegg: `newegg`
- Duckduckgo: `ddg`
- YouTube: `youtube`
- Rotten Tomatoes: `rt`
- Wolfram Alpha: `wolfram`
- Zappos: `zappos`
- Twitter: `twitter`
- IMDB: `imdb`

# Force Regular Search

You can force a regular search without keyword matching by prepending the query with a `!`, eg: `!amazon headquarters`.

# Version History

### Unreleased
- [Feature] Using `{rawsearch}` does not escape query string

### 1.5.1
- [Other] Removed some unused code

### 1.5.0
- [Feature] Copy to clipboard directly from import/export
- [Enhancement] Now backed by Redux instead of Backbone
- [Enhancement] Updated all 3rd party dependencies
- [Enhancement] Small UI tweaks

### 1.4.1
- [Bugfix] `javascript://` urls where causing exceptions.

### 1.4.0
- [Feature] Adds option for disabling `!` search.
- [Feature] Adds option for disabling analytics reporting.

### 1.3.2
- [Bugfix] Small fixes.

### 1.3.1
- [Bugfix] Fixes import/export feature.

### 1.3
- [Feature] Added option for toggling Amazon referrals.

### 1.2
- [Feature] Updated UI.
- [Bugfix] Update default search URLs.

### 1.1.0
- [Feature] Added import/export capabilities to sites.

### 1.0.9

- [Bugfix] Some internal RegEx fixes.

### 1.0.8 & 1.0.7

- [Bugfix] Update default Twitter search url that comes bundled with the app and added affiliate tag to search results.

### 1.0.6 & 1.0.5

- [Analytics] Tracking some usage, nothing identifiable just generic events.

### 1.0.4

- [Bugfix] Fix for international characters on site keywords.
- [Bugfix] Smaller download file.

### 1.0.3

- [Bugfix] Added support for international characters.

### 1.0.1

- [Bugfix] Using `{%search}` now encodes every space
- [Feature] Added Amazon mp3 as the default site, key: `mp3`

### 1.0

- [Feature] Added option for setting default search site for all searches.

### 0.10.1

- [Bugfix] Fixed URL encoding issues.

### 0.10

- [Improvement] Omnikey used to work in a hacky kind of way, now it listens for the `beforeSearch` event which makes it way more faster and prevents the rare Google screen flicker.

### 0.9.1

- [Bugfix] Taking into account localized versions of Safari that perform searches on different domains, this fixes issues that prevented Omnikey from doing it's magic when running in other languages (thanks to Lukas Herman for reporting).

### 0.9

- First release
