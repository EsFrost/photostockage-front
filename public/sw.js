if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,c)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let n={};const d=e=>a(e,t),r={module:{uri:t},exports:n,require:d};s[t]=Promise.all(i.map((e=>r[e]||d(e)))).then((e=>(c(...e),n)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"e37304ae741de484b8bcb00fad7787c3"},{url:"/_next/static/KeCzasXhKblipe1ttdzcd/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/KeCzasXhKblipe1ttdzcd/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/117-b518cf4c556a24ab.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/53c13509-5db9a88b8809a867.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/878-ae407474409c9157.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/972-f8e6bf99efb12a12.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/987-c2afd3eb9923c77f.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/_not-found/page-c1bbe1b4bc8170a6.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/about/page-a6f428fe7b968ccf.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/account/page-365d8f097ee6b35d.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/contact/page-88d872f235109653.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/dashboard/page-40c0607d1944c882.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/layout-f34e94c1f79605ba.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/login/page-02cb4b635fd00262.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/not-found-a165b46dee0de623.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/page-a2d44cf3cb799c0f.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/photo/%5Bid%5D/page-d04bb3226f158d85.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/app/register/page-a51003f6c61590fe.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/ccd63cfe-c47b469ed42839e6.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/fc2f6fa8-69b52cd8a44d2efa.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/fd9d1056-75b5a93c97da044e.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/framework-aec844d2ccbe7592.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/main-010c268933c6201b.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/main-app-98faaed6f15ef754.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-074987c53fb04d31.js",revision:"KeCzasXhKblipe1ttdzcd"},{url:"/_next/static/css/43eddae451b9684f.css",revision:"43eddae451b9684f"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/logo_full.887eeeb4.png",revision:"fb3fcec13028b8aa4013c0f85c748063"},{url:"/favicon.ico",revision:"65e4c811baf7030a76cb27a759a72616"},{url:"/images/demo/image-1.jpg",revision:"c46192c74a2acb6ed4ec585f5fb46bbc"},{url:"/images/demo/image-10.jpg",revision:"3a4c2180850d294a42aff0246824242c"},{url:"/images/demo/image-2.jpg",revision:"0544896dfc1767ba8b314437c8999c7d"},{url:"/images/demo/image-3.jpg",revision:"dd9e839597757013f6d664bd5d31190f"},{url:"/images/demo/image-4.jpg",revision:"343ff6a70175aa44a10bc158e350eede"},{url:"/images/demo/image-5.jpg",revision:"765d4ff34e06f9056e8a31e99133eef7"},{url:"/images/demo/image-6.jpg",revision:"957b2e19dc53a0fc615e911d08953c1e"},{url:"/images/demo/image-7.jpg",revision:"073b0b9b26e279c7852735328e32c23f"},{url:"/images/demo/image-8.jpg",revision:"ba8236777b4ed292da002b8af46ffffc"},{url:"/images/demo/image-9.jpg",revision:"a192292ce3cd737808381a67cc932a95"},{url:"/images/pexels.jpg",revision:"765d4ff34e06f9056e8a31e99133eef7"},{url:"/images/users/04a4826c-0754-4264-970b-eeca75da6582.jpg",revision:"397f49b95457f90c63f304ff43e4f027"},{url:"/images/users/2ec7eb2a-1c6e-4d02-a812-f6ba7fc63c9a.jpg",revision:"ae0343309691775885cacec2c3b7af3a"},{url:"/images/users/3ff3abc9-c94d-43b1-b0a2-94c152e66c14.jpg",revision:"a88a7963d44ad3df5b6da0587300c7e2"},{url:"/images/users/6bdb9cc8-1c0a-4eda-b096-aeca9a98414b.png",revision:"66addb730a7f980a3ea7015d4c1a4ba3"},{url:"/images/users/7306b0ac-120e-4688-add2-435d16ed644e.png",revision:"0894be1d94d9205664c4e2d7a92b1a15"},{url:"/images/users/96c3eceb-b3d1-4fd8-b7e9-eb3fedffc3a7.jpg",revision:"ef50cc73028ffcb4e300ea7aa247e968"},{url:"/images/users/a506f651-d2ae-4568-85d8-cb029b76c4d2.png",revision:"66addb730a7f980a3ea7015d4c1a4ba3"},{url:"/images/users/bf863973-0857-4656-867f-c5f2a530eecd.jpg",revision:"e763a0d73bb2804d51746652b23e3e7c"},{url:"/images/users/e3c71c53-50e0-4096-973a-c746d518444b.jpg",revision:"765d4ff34e06f9056e8a31e99133eef7"},{url:"/images/users/e402baef-e669-4de7-9bc0-6540c7031a9a.png",revision:"5b3062ee0d462ee1118b39ee70e204a5"},{url:"/images/users/e7f3b1e9-7959-4d65-a692-e7ebc0d6de61.png",revision:"66addb730a7f980a3ea7015d4c1a4ba3"},{url:"/logo_full.png",revision:"fb3fcec13028b8aa4013c0f85c748063"},{url:"/logo_mobile.png",revision:"984aea6484e3ed04e0d714022b3552b8"},{url:"/manifest.json",revision:"922c59157e292b87b8c48f5761e68770"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
