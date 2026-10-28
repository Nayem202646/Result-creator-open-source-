# Nayem202646 School — GitHub-ready website

এই প্যাকেজে সরাসরি GitHub repository-তে আপলোড করে GitHub Pages-এ প্রকাশ করার মতো ফাইল সাজানো আছে। ZIP খুললে `index.html`, `sw.js`, `manifest.webmanifest` এবং `.github/workflows/pages.yml` একই মূল ফোল্ডারে থাকবে।

## GitHub Pages-এ প্রকাশ

1. ZIP ফাইলটি Extract করুন।
2. GitHub-এ একটি repository তৈরি করুন। GitHub Free-এ Pages ব্যবহার করতে public repository লাগতে পারে; public হলে সোর্স কোড যে কেউ দেখতে পারবে।
3. Repository-তে **Add file → Upload files** বেছে নিন।
4. Extract করা প্যাকেজের **ভেতরের ফাইলগুলো** (index.html, sw.js, manifest.webmanifest, .github, README.md, .gitignore এবং optional online ফোল্ডার) repository-এর root-এ upload করুন। `index.html` সরাসরি root-এ থাকতে হবে।
5. **Commit changes** করুন।
6. **Settings → Pages → Build and deployment → Source: GitHub Actions** নির্বাচন করুন। এই প্যাকেজের workflow-টি push হলে সাইট প্রকাশ করবে।
7. **Actions** ট্যাবে “Publish GitHub Pages” workflow সফল হলে Settings → Pages-এ দেওয়া website link খুলুন।

## সাইট ব্যবহার ও ডেটা

- সাইটের UI কোড `index.html`-এ আছে; `manifest.webmanifest` ও `sw.js` অফলাইন/PWA ব্যবহার সামলায়।
- GitHub Pages সংস্করণে ফলাফল ও সেটিংস সেই ব্রাউজারের localStorage-এ থাকে। অন্য ব্রাউজার/ডিভাইসে স্বয়ংক্রিয়ভাবে সিঙ্ক হয় না। JSON backup/export ব্যবহার করুন।
- কোনো শিক্ষার্থীর ফলাফল বা বাস্তব backup এই package-এ নেই। এগুলো public GitHub-এ upload করবেন না।
- ডিফল্ট অ্যাডমিন UI পাসওয়ার্ড `nayem`; সাইটের অ্যাকশন মেনু থেকে বদলানো যায়। এটি public static website-এর UI lock মাত্র, নিরাপদ login ব্যবস্থা নয়। গোপন ফলাফল এই লকে ভরসা করে রাখবেন না।
- Windows notification ও reminder আলাদা করে চালু করতে হয়। সাইট খোলা থাকতে হবে এবং browser notification permission দিতে হবে।

## Optional online server

`online/` ফোল্ডারে Node.js 20+ server-এর code আছে। GitHub Pages Node.js সার্ভার চালায় না; online sync চাইলে `online/README.md` অনুযায়ী আলাদা HTTPS hosting-এ চালান এবং `ADMIN_TOKEN` host-এর secret/environment variable হিসেবে দিন। GitHub-এ আসল token, `.env` বা `online/data/state.json` upload করবেন না.

## ZIP-এর root ফাইলসমূহ

```text
index.html
sw.js
manifest.webmanifest
README.md
.gitignore
.github/workflows/pages.yml
online/
  .env.example
  README.md
  package.json
  server.mjs
```
