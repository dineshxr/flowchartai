/**
 * Submit URLs to IndexNow so Bing (and every engine on the protocol —
 * Seznam, Naver, Yandex, …) recrawls them without waiting for the sitemap.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                    # every URL in the live sitemap
 *   node scripts/indexnow-ping.mjs /pricing /blog/x   # specific paths or full URLs
 *
 * Ownership proof: the key must be live at https://<host>/<key>.txt —
 * it's checked before pinging. The file lives in public/<key>.txt.
 */

const HOST = 'www.infogiph.com';
const KEY = '0b17d442c34bb4cbe354dd08f8153300';
// Any single IndexNow endpoint propagates to all participating engines.
const ENDPOINT = 'https://www.bing.com/indexnow';

const args = process.argv.slice(2);
let urls;
if (args.length > 0) {
  urls = args.map((u) => (u.startsWith('http') ? u : `https://${HOST}${u}`));
} else {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) {
    console.error(`✗ Could not fetch sitemap (HTTP ${res.status})`);
    process.exit(1);
  }
  const xml = await res.text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (urls.length === 0) {
  console.error('✗ No URLs to submit');
  process.exit(1);
}

// Fail fast if the key file isn't deployed — Bing rejects the batch otherwise.
const keyUrl = `https://${HOST}/${KEY}.txt`;
const keyRes = await fetch(keyUrl, { cache: 'no-store' });
const keyBody = (await keyRes.text()).trim();
if (!keyRes.ok || keyBody !== KEY) {
  console.error(
    `✗ Key file not live at ${keyUrl} (HTTP ${keyRes.status}) — deploy before pinging.`
  );
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: keyUrl, urlList: urls }),
});

console.log(`Submitted ${urls.length} URLs → HTTP ${res.status} ${res.statusText}`);
if (res.status === 200) {
  console.log('✓ Accepted. Bing crawls at its own pace — check Bing Webmaster Tools for status.');
} else if (res.status === 202) {
  console.log('✓ Accepted (202) — key validation still pending on the engine side.');
} else {
  // 400 bad format · 403 invalid key · 422 URLs off-host · 429 slow down
  console.error(await res.text());
  process.exit(1);
}
