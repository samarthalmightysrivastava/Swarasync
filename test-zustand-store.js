const puppeteer = require('puppeteer');

async function testZustandStore() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('🖥️  BROWSER:', msg.text());
  });
  
  try {
    console.log('🌐 Loading page...');
    await page.goto('https://3000-i7grkd9sf5yeu3rk3ze8s-6532622b.e2b.dev/play');
    await page.waitForSelector('button');
    
    console.log('🔍 Looking for store test component...');
    const storeTest = await page.evaluate(() => {
      const storeDiv = document.querySelector('.bg-yellow-100');
      const storeButton = document.querySelector('.bg-yellow-500');
      const storeText = storeDiv?.textContent || 'Not found';
      
      return {
        storeDivExists: !!storeDiv,
        storeButtonExists: !!storeButton,
        initialStoreText: storeText
      };
    });
    console.log('📊 Store test elements:', storeTest);
    
    if (storeTest.storeButtonExists) {
      console.log('🎯 Clicking store test button...');
      await page.evaluate(() => {
        const storeButton = document.querySelector('.bg-yellow-500');
        if (storeButton) storeButton.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔍 Checking if store state changed...');
      const afterStoreClick = await page.evaluate(() => {
        const storeDiv = document.querySelector('.bg-yellow-100');
        return {
          newStoreText: storeDiv?.textContent || 'Not found'
        };
      });
      console.log('📊 After store click:', afterStoreClick);
      
      if (afterStoreClick.newStoreText.includes('Playing: Yes') || afterStoreClick.newStoreText.includes('Round: 1')) {
        console.log('✅ Zustand store is working!');
      } else {
        console.log('❌ Zustand store not working.');
        console.log('Expected change in Round or Playing status');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testZustandStore();