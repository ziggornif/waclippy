import { poses, wirePath } from './animation.js';

// Fil, visage et casquette sont des calques indépendants.
export const character = `<svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs>
  <linearGradient id="wire" x1="0" x2="1"><stop stop-color="#421178"/><stop offset=".36" stop-color="#b36be5"/><stop offset=".6" stop-color="#7023ad"/><stop offset="1" stop-color="#390d65"/></linearGradient>
  <linearGradient id="cap" x2=".7" y2="1"><stop stop-color="#a44cdb"/><stop offset="1" stop-color="#60209d"/></linearGradient>
  <linearGradient id="nose" x2="1" y2=".8"><stop stop-color="#ff98cd"/><stop offset="1" stop-color="#c33882"/></linearGradient>
</defs>
<ellipse class="shadow" cx="119" cy="344" rx="66" ry="9" fill="#29133f" opacity=".16"/>
<g class="body">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path class="wire" d="${wirePath(poses.idle)}" stroke="#35104f" stroke-width="21"/>
    <path class="wire" d="${wirePath(poses.idle)}" stroke="url(#wire)" stroke-width="17"/>
    <path class="wire" d="${wirePath(poses.idle)}" stroke="#d8a0fb" stroke-width="3" opacity=".3" transform="translate(-3 -1)"/>
  </g>
  <g class="head">
  <g class="face">
    <g class="eyes" fill="#fffaf0" stroke="#d9c9de" stroke-width="2">
      <g class="eye eye-left"><ellipse cx="91" cy="133" rx="27" ry="37" transform="rotate(13 91 133)"/><g class="pupil" fill="#201b25" stroke="none"><ellipse cx="95" cy="134" rx="10" ry="19"/><ellipse fill="white" cx="98" cy="127" rx="3" ry="5"/></g></g>
      <g class="eye eye-right"><ellipse cx="151" cy="139" rx="25" ry="34" transform="rotate(15 151 139)"/><g class="pupil" fill="#201b25" stroke="none"><ellipse cx="148" cy="141" rx="9" ry="18"/><ellipse fill="white" cx="151" cy="134" rx="3" ry="5"/></g></g>
    </g>
    <g fill="none" stroke="#211824" stroke-width="10" stroke-linecap="round"><path class="brow brow-left" d="M61 112q9-41 28-17l23 16"/><path class="brow brow-right" d="M131 119q31-35 48-14"/></g>
    <g class="mouth"><path class="smile" d="M113 236q18 22 38-3" fill="#602140" stroke="#35152d" stroke-width="3" stroke-linecap="round"/><ellipse class="gasp" cx="132" cy="242" rx="11" ry="16" fill="#35152d"/><path class="sleep-mouth" d="M123 244q9-7 18 0" fill="none" stroke="#35152d" stroke-width="3" stroke-linecap="round"/></g>
    <g class="moustache"><path d="M119 175 54 159 27 116 45 177 113 193 183 207 218 158 179 190Z" fill="#211824" stroke="#120d16" stroke-linejoin="round" stroke-width="2"/></g>
    <path class="nose" d="M111 165c12-22 39-11 39 10 0 17-12 57-20 57-9 0-23-48-19-67Z" fill="url(#nose)" stroke="#b53a82" stroke-width="1.5"/>
  </g>
  <g class="hat" stroke="#4b1977" stroke-width="3">
    <path d="M47 83C36 43 72 9 119 12c48 1 75 38 67 87Z" fill="url(#cap)"/>
    <ellipse cx="132" cy="49" rx="25" ry="29" fill="#fff9ec" transform="rotate(10 132 49)"/>
    <path d="m122 31 24 4-2 12-13-2-4 24-11-2Z" fill="#f4cf3e"/>
    <path d="M36 89q72-47 152 2l6 14q-76-30-147 3-16 3-11-19Z" fill="#782cb1"/>
    <path d="M48 96q64-30 128-2" fill="none" stroke="#be72e5" stroke-width="3" opacity=".6"/>
  </g>
  </g>
</g>
<g class="sparkles" fill="#e5ba39"><path d="m29 46 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z"/><path d="m211 221 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/></g>
<g class="surprise-lines" fill="none" stroke="#d9ab2f" stroke-width="5" stroke-linecap="round"><path d="m199 36 11-14M211 56l14-5M178 20l2-14"/></g>
<g class="sleep-letters" fill="#9868b4" font-family="system-ui,sans-serif" font-weight="700"><text x="181" y="122" font-size="19">z</text><text x="202" y="100" font-size="26">z</text><text x="215" y="69" font-size="34">Z</text></g>
</svg>`;
