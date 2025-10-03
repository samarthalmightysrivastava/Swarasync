const puppeteer = require('puppeteer');

async function testBasicReact() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('🖥️  BROWSER:', msg.text());
  });
  
  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('🌐 Loading page...');
    await page.goto('https://3000-i7grkd9sf5yeu3rk3ze8s-6532622b.e2b.dev/play');
    await page.waitForSelector('button');
    
    console.log('🔍 Looking for test button...');
    const testResult = await page.evaluate(() => {
      const testDiv = document.querySelector('.bg-red-100');
      const testButton = document.querySelector('.bg-red-500');
      const countText = testDiv?.textContent || 'Not found';
      
      return {
        testDivExists: !!testDiv,
        testButtonExists: !!testButton,
        initialText: countText
      };
    });
    console.log('📊 Test elements:', testResult);
    
    if (testResult.testButtonExists) {
      console.log('🎯 Clicking test button...');
      await page.evaluate(() => {
        const testButton = document.querySelector('.bg-red-500');
        if (testButton) testButton.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔍 Checking if count changed...');
      const afterClick = await page.evaluate(() => {
        const testDiv = document.querySelector('.bg-red-100');
        return {
          newText: testDiv?.textContent || 'Not found'
        };
      });
      console.log('📊 After click:', afterClick);
      
      if (afterClick.newText.includes('1')) {
        console.log('✅ React is working! Count increased.');
      } else {
        console.log('❌ React not working. Count did not increase.');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testBasicReact();