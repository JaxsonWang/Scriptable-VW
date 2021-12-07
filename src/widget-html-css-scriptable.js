//Twitter: https://twitter.com/DamianCatanzaro

const html = "<html> \
    <head> \
        <style> \
            body { \
                margin: 0; \
                padding: 0; \
                width: 400px; \
                height: 400px; \
            } \
            .container { \
                margin: 0; \
                padding: 0; \
                width: 200px; \
                height: 200px; \
            } \
        </style> \
    </head> \
    <body> \
        <div id='container' class='container'></div> \
    </body> \
</html>"

const html1 = "<html> \
    <head> \
        <style> \
            html, body,\
            #container { \
                margin: 0; \
                padding: 0; \
                width: 100%; \
                height: 100%; \
            } \
        </style> \
    </head> \
    <body> \
        <div id='container'></div> \
        <script type='text/javascript' src='https://audi.i95.me/1.js'></script> \
    </body> \
</html>";

const js = `!function(t){"use strict";var g={parseExtension:function(t){return"png"},canvasToBlob:function(e){return e.toBlob?new Promise(function(t){e.toBlob(t)}):function(i){return new Promise(function(t){for(var e=window.atob(i.toDataURL().split(",")[1]),n=e.length,r=new Uint8Array(n),o=0;o<n;o++)r[o]=e.charCodeAt(o);t(new Blob([r],{type:"image/png"}))})}(e)},uid:function(){var t=0;return function(){return"u"+("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)+t++}}(),delay:function(n){return function(e){return new Promise(function(t){setTimeout(function(){t(e)},n)})}},asArray:function(t){for(var e=[],n=t.length,r=0;r<n;r++)e.push(t[r]);return e},escapeXhtml:function(t){return t},makeImage:function(r){return new Promise(function(t,e){var n=new Image;n.onload=function(){t(n)},n.onerror=e,n.src=r})},width:function(t){var e=r(t,"border-left-width"),n=r(t,"border-right-width");return t.scrollWidth+e+n},height:function(t){var e=r(t,"border-top-width"),n=r(t,"border-bottom-width");return t.scrollHeight+e+n}};function r(t,e){var n=window.getComputedStyle(t).getPropertyValue(e);return parseFloat(n.replace("px",""))}var e={imagePlaceholder:void 0,cacheBust:!1},n={toSvg:o,toBlob:function(t,e){return function(n,r){return o(n,r).then(g.makeImage).then(g.delay(100)).then(function(t){var e=function(t){var e=document.createElement("canvas");{var n;e.width=r.width||g.width(t),e.height=r.height||g.height(t),r.bgcolor&&((n=e.getContext("2d")).fillStyle=r.bgcolor,n.fillRect(0,0,e.width,e.height))}return e}(n);return e.getContext("2d").drawImage(t,0,0),e})}(t,e||{}).then(g.canvasToBlob)},impl:{options:{},util:g}};function o(o,i){return function(t){void 0===t.imagePlaceholder?n.impl.options.imagePlaceholder=e.imagePlaceholder:n.impl.options.imagePlaceholder=t.imagePlaceholder;void 0===t.cacheBust?n.impl.options.cacheBust=e.cacheBust:n.impl.options.cacheBust=t.cacheBust}(i=i||{}),Promise.resolve(o).then(function(t){return function i(e,n,t){if(!t&&n&&!n(e))return Promise.resolve();return Promise.resolve(e).then(r).then(function(t){return o(e,t,n)}).then(function(t){return u(e,t)});function r(t){return t instanceof HTMLCanvasElement?g.makeImage(t.toDataURL()):t.cloneNode(!1)}function o(t,e,n){var r=t.childNodes;return 0===r.length?Promise.resolve(e):o(e,g.asArray(r),n).then(function(){return e});function o(e,t,n){var r=Promise.resolve();return t.forEach(function(t){r=r.then(function(){return i(t,n)}).then(function(t){t&&e.appendChild(t)})}),r}}function u(f,d){return d instanceof Element?Promise.resolve().then(t).then(e).then(n).then(r).then(function(){return d}):d;function t(){function t(t,e){var n,r;t.cssText?e.cssText=t.cssText:(n=t,r=e,g.asArray(n).forEach(function(t){r.setProperty(t,n.getPropertyValue(t),n.getPropertyPriority(t))}))}t(window.getComputedStyle(f),d.style)}function e(){function e(t){var e,n,r,o,i,u,c,a,h=window.getComputedStyle(f,t),l=h.getPropertyValue("content");function s(t){return t+": "+r.getPropertyValue(t)+(r.getPropertyPriority(t)?" !important":"")}""!==l&&"none"!==l&&(e=g.uid(),d.className=d.className+" "+e,(n=document.createElement("style")).appendChild((c="."+e+":"+t,a=(u=h).cssText?(i=(o=o=u).getPropertyValue("content"),o.cssText+" content: "+i+";"):(r=u,g.asArray(r).map(s).join("; ")+";"),document.createTextNode(c+"{"+a+"}"))),d.appendChild(n))}[":before",":after"].forEach(function(t){e(t)})}function n(){f instanceof HTMLTextAreaElement&&(d.innerHTML=f.value),f instanceof HTMLInputElement&&d.setAttribute("value",f.value)}function r(){d instanceof SVGElement&&(d.setAttribute("xmlns","http://www.w3.org/2000/svg"),d instanceof SVGRectElement&&["width","height"].forEach(function(t){var e=d.getAttribute(t);e&&d.style.setProperty(t,e)}))}}}(t,i.filter,!0)}).then(function(e){i.bgcolor&&(e.style.backgroundColor=i.bgcolor);i.width&&(e.style.width=i.width+"px");i.height&&(e.style.height=i.height+"px");i.style&&Object.keys(i.style).forEach(function(t){e.style[t]=i.style[t]});return e}).then(function(t){return e=t,n=i.width||g.width(o),r=i.height||g.height(o),Promise.resolve(e).then(function(t){return t.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),(new XMLSerializer).serializeToString(t)}).then(g.escapeXhtml).then(function(t){return'<foreignObject x="0" y="0" width="100%" height="100%">'+t+"</foreignObject>"}).then(function(t){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+n+'" height="'+r+'">'+t+"</svg>"}).then(function(t){return"data:image/svg+xml;charset=utf-8,"+t});var e,n,r})}"undefined"!=typeof module?module.exports=n:t.domtoimage=n}(this);

const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

const iframedoc = iframe.contentDocument || iframe.contentWindow.document;
iframedoc.body.innerHTML = "${html}";

const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
};

setTimeout(function () {
    const createScript = document.createElement('script')
    createScript.src = 'https://audi.i95.me/1.js'
    document.head.appendChild(createScript)
    domtoimage.toBlob(iframedoc.body).then(async (blob) => {
        completion(await blobToBase64(blob));
    });
}, 1);
`;

const wv = new WebView();
const base64Image = await wv.evaluateJavaScript(js, true);
console.log(wv)
console.log(base64Image)

const widget = new ListWidget();

const imgReqBq = await new Request(base64Image);
const imgBq = await imgReqBq.loadImage();

widget.backgroundImage = imgBq;

if (config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
} else {
    widget.presentLarge();
}
