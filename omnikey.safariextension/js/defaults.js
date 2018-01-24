var Omnikey = Omnikey || {};

Omnikey.STORAGE_KEY = 'sites';
Omnikey.default_sites = [
  {
    key: "amazon",
    url: "http://www.amazon.com/s/?link_code=wsw&_encoding=UTF-8&search-alias=aps&field-keywords={search}&Submit.x=0&Submit.y=0&Submit=Go"
  },
  {
    key: "youtube",
    url: "http://www.youtube.com/results?search_query={search}"
  },
  {
    key: "twitter",
    url: "https://twitter.com/search?q={search}"
  },
  {
    key: "spotify",
    url: "https://open.spotify.com/search/results/{%search}"
  },
  {
    key: "ebay",
    url: "http://www.ebay.com/sch/i.html?_trksid=p5197.m570.l1313&_nkw={search}&_sacat=0"
  },
  {
    key: "wiki",
    url: "http://en.wikipedia.org/w/index.php?title=Special:Search&search={search}"
  },
  {
    key: "zappos",
    url: "http://www.zappos.com/search?term={search}"
  },
  {
    key: "maps",
    url: "https://maps.google.com/maps?hl=en&authuser=0&q={search}&ie=UTF-8"
  },
  {
    key: "rt",
    url: "http://www.rottentomatoes.com/search/?search={search}"
  },
  {
    key: "imdb",
    url: "http://www.imdb.com/find?q={search}&s=all"
  },
  {
    key: "ddg",
    url: "http://duckduckgo.com/?q={search}"
  },
  {
    key: "wolfram",
    url: "http://www.wolframalpha.com/input/?i={search}"
  }
];
