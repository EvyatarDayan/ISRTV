/**
 * Browser console helper — run this ON an open Kan episode tab
 * (DevTools → Console) after pressing Play once.
 *
 * It prints the best Manifest.ism / stream URL found in performance entries
 * and copies it to the clipboard when possible.
 */
(function () {
  const urls = performance.getEntriesByType('resource')
    .map((e) => e.name)
    .filter((u) => /Manifest\.ism|\.mpd|playManifest|cdn-redge.*\/vod\//i.test(u))
    .map((u) => u.replace(/\?.*$/, ''))
    .filter((u, i, arr) => arr.indexOf(u) === i);

  if (!urls.length) {
    console.warn('No stream URL found yet. Press Play, wait 2s, run again.');
    return;
  }

  console.table(urls.map((u) => ({ streamURL: u })));
  console.log('Best candidate:\n' + urls[0]);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(urls[0]).then(function () {
      console.log('Copied to clipboard');
    });
  }
})();
