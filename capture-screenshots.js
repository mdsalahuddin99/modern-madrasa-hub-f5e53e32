import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// ফোল্ডার তৈরি করার লোকেশন
const OUT_DIR = path.join(process.cwd(), 'play_store_screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

// যে পেজগুলোর স্ক্রিনশট নেওয়া হবে
const pagesToCapture = [
  { name: '1_HomePage', path: '/' },
  { name: '2_Madrasa_List', path: '/madrasas' },
  { name: '3_About_Page', path: '/about' },
  // আপনার যদি কোনো নির্দিষ্ট মাদ্রাসার পেইজ থাকে, তবে নিচে তার URL দিতে পারেন
  // { name: '4_Madrasa_Details', path: '/madrasas/ayesha-siddiqa-mohila-madrasa' }
];

const BASE_URL = 'http://localhost:3000';

(async () => {
  console.log('ব্রাউজার চালু হচ্ছে...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=428,926']
  });
  
  const page = await browser.newPage();
  
  // আধুনিক মোবাইল স্ক্রিন সাইজ (iPhone 13 Pro Max)
  await page.setViewport({
    width: 428,
    height: 926,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  for (const item of pagesToCapture) {
    const url = `${BASE_URL}${item.path}`;
    console.log(`ভিজিট করা হচ্ছে: ${url}...`);
    
    // পেজ পুরোপুরি লোড হওয়ার জন্য অপেক্ষা করা
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // এনিমেশন শেষ হওয়ার জন্য একটু সময় নেওয়া
    await new Promise(r => setTimeout(r, 2500));
    
    const outPath = path.join(OUT_DIR, `${item.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    
    console.log(`✅ সেভ করা হয়েছে: ${item.name}.png`);
  }

  await browser.close();
  console.log('🎉 সব কাজ শেষ! "play_store_screenshots" ফোল্ডারটি চেক করুন।');
})();
