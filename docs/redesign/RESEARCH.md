# Gupt Sabha: game-interface research and redesign

## What changes
The first build proved the mechanics, but its editorial homepage, thumbnail theme picker, and long player lists made the experience feel like a website around a game. This pass makes deck selection the opening screen, the lobby a council seating board, and private identity a tactile card interaction. Rules and server authority remain intact.

## Research → decisions

| Evidence | Application to this game |
| --- | --- |
| Hearthstone phone UI designer Max Ma describes a major screen-by-screen rework while keeping established players at home. [Designer case study](https://www.behance.net/gallery/25695693/Hearthstone-UI) | Mobile gets a compact stage, clear primary action, and a persistent shortcut to private identity. It does not simply stack the desktop sidebar below the game. |
| Microsoft XAG 112 recommends consistent navigation and predictable focus order. [UI navigation](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/112) | Turn guidance, expedition progress, and action placement remain consistent across the three visual themes. Click/tap and keyboard work; no drag-only decisions. |
| Microsoft XAG 114 calls for notification of uninitiated context changes and realistic previews for UI settings. [UI context](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/114) | Phase changes retain polite announcements. Theme selection previews actual role art and the real card back, not generic thumbnails. |
| W3C recommends adequate contrast and redundant cues alongside colour. [Designing for accessibility](https://www.w3.org/WAI/tips/designing/) | Allegiance and results have labels and icons; ornate art never sits behind rules text. Controls remain readable in all three palettes. |

These are design inferences applied to Gupt Sabha, not claims that the cited teams tested this game. No new gameplay mechanics are introduced by this research.

## Three binding references, in supplied order
1. **Katha / Ink legends**: black and warm bone; flat silhouettes, sweeping negative space, delicate contour ornaments. Avoid the first build's detailed painted portraits and gold frames.
2. **Rang / Electric royalty**: cobalt, lavender, fuchsia, orange, yellow and emerald; contemporary Indian pop portraits, graphic hair and jewellery, expressive faces.
3. **Vana / Spirit wilds**: deep teal, moss, jade and luminous lime; dynamic illustrated poses, wind, forest layers and spectral line art.

Original fictional characters retain their role names and knowledge. All eight roles and one common card back are regenerated per theme. Backs never encode allegiance. Uploaded art is a style reference, not copied final card art.

## Direction contract
User-pinned reference art governs the new world. Seven grounded carriers considered: physical card box, illustrated character folio, carved courtyard seating, three-world deck selector, shadow-theatre stage, festival poster wall, expedition map. The deck selector is the chosen carrier (seed 06be8c35, assigned index 4); unrelated catalog forms cannot displace the explicit Indian card-art brief. Its discipline is art at meaningful scale, navigation by deck, and one concrete invitation action.

Opening screen: title and short play premise; three large theme worlds whose selected art expands; an action dock containing room creation and joining. Mobile: tabs select one large artwork stage, with immediately reachable room actions.

Gameplay: council seats, visible turn guidance, framed expedition path, printed-card reveal, distinct Support/Sabotage cards. Mobile private identity lives in a user-opened sheet with a persistent access control. Reduced motion keeps instant, fully operable states.

## Validation boundary
Visual inspection on desktop and mobile; full multiplayer browser regression; keyboard focus, secret-role concealment, theme selection and card-back checks. Actual physical-device or screen-reader speech testing is not claimed.
