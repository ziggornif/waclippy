export const styles = `
:host{all:initial;position:fixed;bottom:20px;right:20px;z-index:var(--waclippy-z-index,2147483000);display:block;width:min(310px,calc(100vw - 40px));font:15px/1.5 system-ui,sans-serif;color:#2d2039;color-scheme:light;pointer-events:none}
:host([data-position="bottom-left"]){right:auto;left:20px}
:host([hidden]){display:none!important}
*{box-sizing:border-box}button{font:inherit;cursor:pointer}button:focus-visible{outline:3px solid #7628b4;outline-offset:4px}
.bubble{pointer-events:auto;position:relative;background:#fff8d6;border:2px solid #55455c;border-radius:16px;padding:22px;box-shadow:4px 5px 0 #3a214520;margin-bottom:3px}
.bubble::after{content:"";position:absolute;bottom:-12px;right:74px;width:20px;height:20px;background:#fff8d6;border-right:2px solid #55455c;border-bottom:2px solid #55455c;transform:skewY(-25deg) rotate(45deg)}
:host([data-position="bottom-left"]) .bubble::after{right:auto;left:74px}
.bubble[hidden]{display:none}.label{font-size:10px;letter-spacing:.15em;font-weight:800;color:#7a4a90;text-transform:uppercase;margin-bottom:10px}.message{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;max-height:35vh;overflow-y:auto;padding-right:10px}
.close{position:absolute;right:9px;top:7px;border:0;background:transparent;color:#69546a;font-size:22px;line-height:1;padding:5px}
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.actions:empty{display:none}.action{border:1px solid #a8997d;box-shadow:0 2px 0 #c6b98f;border-radius:7px;padding:7px 13px;background:#fffced;color:#3c2c3d}.action:first-child{background:#7632a5;border-color:#65268f;color:white;box-shadow:0 2px 0 #49176b}.action:hover{filter:brightness(.95)}.action:disabled{cursor:wait;opacity:.6}
.character{pointer-events:auto;display:block;position:relative;width:150px;height:225px;margin:8px 24px 0 auto;padding:0;border:0;background:none;-webkit-tap-highlight-color:transparent}.character svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 8px 8px #29133f16)}
:host([data-position="bottom-left"]) .character{margin-right:auto;margin-left:24px}
.body{transform-origin:120px 330px;animation:breathe 4s ease-in-out infinite}.eyes{transform-box:fill-box;transform-origin:center;animation:blink 6s infinite}
.head{transform-origin:120px 110px}.hat{transform-origin:120px 95px}.brow,.eye{transform-box:fill-box;transform-origin:center}.moustache{transform-origin:125px 185px}.nose{transform-origin:127px 164px}.shadow{transform-origin:119px 344px}.sparkles,.surprise-lines,.sleep-letters{opacity:0;pointer-events:none}.gasp,.sleep-mouth{display:none}
:host([data-animation="wave"]) .body{animation:wave var(--wa-duration) ease-in-out}
:host([data-animation="wave"]) .hat{animation:hat-tip var(--wa-duration) ease-in-out}
:host([data-animation="wave"]) .eye-left{animation:wink var(--wa-duration) ease-in-out}
:host([data-animation="celebrate"]) .body{animation:celebrate var(--wa-duration) ease-in-out}
:host([data-animation="celebrate"]) .hat{animation:hat-jump var(--wa-duration) ease-in-out}
:host([data-animation="celebrate"]) .moustache{animation:happy-moustache .4s ease-in-out 6}
:host([data-animation="celebrate"]) .eye-left{animation:wink var(--wa-duration) ease-in-out}
:host([data-animation="celebrate"]) .sparkles{animation:sparkle var(--wa-duration) ease-in-out}
:host([data-animation="celebrate"]) .shadow{animation:jump-shadow var(--wa-duration) ease-in-out}
:host([data-animation="think"]) .body{animation:think var(--wa-duration) ease-in-out}
:host([data-animation="think"]) .pupil{animation:look-up var(--wa-duration) ease-in-out}
:host([data-animation="think"]) .brow-left{animation:question-brow var(--wa-duration) ease-in-out}
:host([data-animation="think"]) .brow-right{animation:skeptical-brow var(--wa-duration) ease-in-out}
:host([data-animation="think"]) .moustache{animation:ponder-moustache var(--wa-duration) ease-in-out}
:host([data-animation="point"]) .body{animation:point-lean var(--wa-duration) ease-in-out}
:host([data-animation="point"]) .pupil{animation:look-point var(--wa-duration) ease-in-out}
:host([data-animation="point"]) .brow-right{animation:question-brow var(--wa-duration) ease-in-out}
:host([data-animation="point"]) .head{animation:point-head var(--wa-duration) ease-in-out}
:host([data-animation="fold"]) .body,:host([data-animation="sleep"]) .body{animation:none}
:host([data-animation="fold"]) .head{animation:fold-head var(--wa-duration) ease-in-out}
:host([data-animation="fold"]) .eyes{animation:squint var(--wa-duration) ease-in-out}
:host([data-animation="fold"]) .moustache{animation:ponder-moustache var(--wa-duration) ease-in-out}
:host([data-animation="sleep"]) .head{animation:sleep-head var(--wa-duration) ease-in-out}
:host([data-animation="sleep"]) .eyes{animation:sleep-eyes var(--wa-duration) ease-in-out}
:host([data-animation="sleep"]) .smile,:host([data-animation="surprised"]) .smile{display:none}
:host([data-animation="sleep"]) .sleep-mouth,:host([data-animation="surprised"]) .gasp{display:block}
:host([data-animation="sleep"]) .sleep-letters{animation:snore var(--wa-duration) ease-in-out}
:host([data-animation="surprised"]) .body{animation:startle var(--wa-duration) ease-in-out}
:host([data-animation="surprised"]) .eyes{animation:wide-eyes var(--wa-duration) ease-in-out}
:host([data-animation="surprised"]) .brow{animation:question-brow var(--wa-duration) ease-in-out}
:host([data-animation="surprised"]) .hat{animation:hat-startle var(--wa-duration) ease-in-out}
:host([data-animation="surprised"]) .surprise-lines{animation:sparkle var(--wa-duration) ease-in-out}
@keyframes breathe{50%{transform:translateY(-4px) rotate(1.5deg)}}
@keyframes blink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.06)}}
@keyframes wave{0%,100%{transform:rotate(0)}18%,50%,82%{transform:rotate(-4deg)}34%,66%{transform:rotate(3deg)}}
@keyframes celebrate{0%,100%{transform:translateY(0) scale(1)}12%,40%,70%{transform:translateY(6px) scale(1.05,.94)}27%,55%,83%{transform:translateY(-30px) scale(.96,1.04)}}
@keyframes think{0%,100%{transform:rotate(0)}22%,78%{transform:rotate(-5deg)}}
@keyframes hat-tip{0%,100%{transform:rotate(0)}20%,70%{transform:translate(0,-8px) rotate(-9deg)}}
@keyframes wink{0%,22%,42%,100%{transform:scaleY(1)}27%,37%{transform:scaleY(.08)}}
@keyframes hat-jump{0%,12%,40%,70%,100%{transform:translateY(0)}27%,55%,83%{transform:translateY(-14px) rotate(-7deg)}}
@keyframes happy-moustache{50%{transform:rotate(-5deg) scaleX(1.05)}}
@keyframes sparkle{0%,10%,95%,100%{opacity:0}25%,75%{opacity:1}}
@keyframes jump-shadow{0%,100%{transform:scaleX(1);opacity:.16}27%,55%,83%{transform:scaleX(.6);opacity:.08}12%,40%,70%{transform:scaleX(1.12);opacity:.2}}
@keyframes look-up{0%,100%{transform:translate(0)}22%,78%{transform:translate(-6px,-9px)}}
@keyframes question-brow{0%,100%{transform:translateY(0)}22%,78%{transform:translateY(-13px) rotate(-8deg)}}
@keyframes skeptical-brow{0%,100%{transform:translateY(0)}22%,78%{transform:translateY(4px) rotate(10deg)}}
@keyframes ponder-moustache{0%,100%{transform:rotate(0)}25%,75%{transform:rotate(7deg)}}
@keyframes point-lean{0%,100%{transform:rotate(0)}22%,78%{transform:rotate(-4deg)}}
@keyframes point-head{0%,100%{transform:rotate(0)}22%,78%{transform:rotate(8deg)}}
@keyframes look-point{0%,100%{transform:translate(0)}22%,78%{transform:translate(7px,-9px)}}
@keyframes fold-head{0%,100%{transform:translateY(0) scale(1)}28%,70%{transform:translate(4px,96px) scale(.86) rotate(8deg)}}
@keyframes squint{0%,100%{transform:scaleY(1)}28%,70%{transform:scaleY(.55)}}
@keyframes sleep-head{0%,100%{transform:translateY(0) scale(1)}23%,82%{transform:translate(4px,96px) scale(.86) rotate(10deg)}45%,65%{transform:translate(4px,100px) scale(.86) rotate(13deg)}}
@keyframes sleep-eyes{0%,100%{transform:scaleY(1)}23%,82%{transform:scaleY(.07)}}
@keyframes snore{0%,15%,95%,100%{opacity:0;transform:translateY(8px)}30%,65%{opacity:1}82%{opacity:0;transform:translateY(-22px)}}
@keyframes startle{0%,100%{transform:translateY(0)}12%{transform:translateY(8px) scale(1.07,.92)}30%{transform:translateY(-23px) scale(.95,1.06)}45%,72%{transform:translateY(-9px)}}
@keyframes wide-eyes{0%,100%{transform:scale(1)}30%,72%{transform:scale(1.12,1.16)}}
@keyframes hat-startle{0%,100%{transform:translateY(0)}30%{transform:translateY(-24px) rotate(-12deg)}50%,72%{transform:translateY(-8px)}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
@media(max-height:550px){.character{width:100px;height:150px}.bubble{padding:14px}.message{max-height:26vh}}
`;
