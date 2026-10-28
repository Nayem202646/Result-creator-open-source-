# চরশী স্কুল রেজাল্ট — অনলাইন সার্ভার

এই Node.js সার্ভার `outputs/index.html` পরিবেশন করে এবং স্কুলের রেকর্ড `online/data/state.json`-এ রাখে। API-তে অ্যাডমিন token লাগে। এটি সরাসরি Google/Microsoft OAuth সংযোগ নয়।

## চালু করা

1. Node.js 20+ HTTPS হোস্টে পুরো `outputs` ফোল্ডারটি দিন; `online` আলাদা করলে পাশের `index.html` পাওয়া যাবে না।
2. Host environment-এ `PORT`, `HOST=0.0.0.0` এবং কমপক্ষে 24 অক্ষরের একটি random `ADMIN_TOKEN` সেট করুন। `.env.example` নমুনা; token-টি ওয়েব ফাইলে লিখবেন না।
3. `outputs/online` থেকে `npm start` চালান এবং HTTPS চালু রাখুন।
4. প্রথম অনলাইন লোডে offline page cache হবে। এরপর একই ব্রাউজারে ইন্টারনেট ছাড়া সাইট ও লোকাল ডেটা চলবে।
5. “অনলাইন ও ব্যাকআপ” মেনুতে সাইটের মূল ঠিকানা ও token দিন। “এই ব্রাউজারের ডেটা পাঠান” সার্ভারের ডেটা প্রতিস্থাপন করে; “সার্ভারের ডেটা আনুন” লোকাল ডেটা প্রতিস্থাপন করে। আগে JSON backup নিন।

## Office / Google Workspace

- Excel/Google Sheets: UTF-8 CSV export.
- Word/Google Docs: HTML-ভিত্তিক `.doc` report.
- সম্পূর্ণ backup: JSON export/import.
- Drive, Sheets API, OneDrive/Excel Graph-এ সরাসরি OAuth upload চালু নেই। প্রতিষ্ঠানের Google Cloud/Microsoft Entra app registration, redirect URI, client ID ও অনুমোদিত access scopes পেলে API সংযোগ কনফিগার করতে হবে। CSV/Word/JSON ফাইল আপাতত Drive-এ হাতে upload করুন।

## ডেটা সুরক্ষা

এটি একটি shared admin token-ভিত্তিক ছোট সার্ভার। Production-এ HTTPS, token গোপন রাখা, নিয়মিত `online/data/state.json` backup এবং সীমিত admin access নিশ্চিত করুন। Host-এর durable storage না থাকলে restart/deploy-এ file মুছে যেতে পারে। ব্রাউজার ও সার্ভারের রেকর্ড স্বয়ংক্রিয়ভাবে merge হয় না।
