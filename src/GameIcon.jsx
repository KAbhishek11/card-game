import React from 'react';
import {Eye, Crown, Spade, ScrollText, Sword, Stamp, ArrowRight, ChevronRight} from 'lucide-react';
// Game icons come from Lucide so they match the rest of the UI. The `kind` names are stable
// so call sites never change; swap the mapping here if a better glyph turns up.
const icons={eye:Eye, crown:Crown, cards:Spade, scroll:ScrollText, sword:Sword, seal:Stamp, arrow:ArrowRight, chevron:ChevronRight};
export function GameIcon({kind='eye',size=28,...props}){const Icon=icons[kind]||Eye;return <Icon size={size} strokeWidth={1.75} aria-hidden="true" {...props}/>}
