# From a website to a council chamber

The user's next request was to enhance the working game UI using real game inspiration. The existing Indian card art, familiar Avalon role names, tactile controls, sound, and private-room mechanics remain binding.

## References and decisions

- [Hearthstone's official presentation](https://hearthstone.blizzard.com/en-us?promo=false) places the game in a tavern world. Application: Gupt Sabha opens in its own illustrated Indian council chamber, with a direct room menu and a visible hand of cards. This is an original environment, not reused Blizzard artwork.
- [Runeterra's launch notes](https://playruneterra.com/en-us/news/patch-1-0-notes/) pair a themed board with card backs. [Riot's board imagery](https://playruneterra.com/th-th/news/game-updates/patch-3-10-0-notes/) shows environment at the edges and clear play space within. Application: the chamber establishes place while opaque decision surfaces protect text contrast; theme selection previews actual card backs and artwork.
- [Runeterra's progression-map imagery](https://playruneterra.com/en-sg/news/game-updates/patch-2-13-0-notes/) makes state spatially visible. Application: retain five expedition tokens and add explicit three-successes / three-failures scores. These are actual game results, with labels as well as color.

These are design interpretations, not claims about those teams' research or copied mechanics. No new rules, progression currencies, or simulated online-player counts were introduced.

## Implementation

The home has a room menu and a three-card fan. Mobile puts room actions before the artwork, with all three world choices available. The game shows an explicit public score and marks the expedition leader. The lobby sits within a council-table environment. Foil, sound controls, and private identity behavior remain available.

Original background: `public/art/council-chamber.png`, generated with the built-in image tool. Exact prompt: `council-chamber-prompt.txt`, also embedded in the PNG. The original card atlases retain their own provenance.

Validation: desktop and mobile screenshots, responsive width checks, full five-player browser game, sound/mute and reduced-motion checks. Physical phone testing is not claimed.
