const puppeteer = require('puppeteer');

async function testStoreDirectly() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Listen for console messages AND errors
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
    
    console.log('🔍 Checking if Zustand store is accessible...');
    const storeTest = await page.evaluate(() => {
      // Try to access the global React DevTools or Zustand
      const hasReact = typeof window.React !== 'undefined';
      const hasDocument = typeof document !== 'undefined';
      const buttonsExist = document.querySelectorAll('button').length > 0;
      
      return {
        hasReact,
        hasDocument,
        buttonsExist,
        windowKeys: Object.keys(window).filter(k => k.includes('react') || k.includes('next') || k.includes('zustand')).slice(0, 10)
      };
    });
    console.log('📊 Store/React check:', storeTest);
    
    console.log('🎯 Trying to click Start button with direct DOM manipulation...');
    const clickResult = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      
      if (startBtn) {
        console.log('✅ Found Start button, clicking...');
        startBtn.click();
        return { success: true, buttonFound: true };
      } else {
        console.log('❌ Start button not found');
        return { 
          success: false, 
          buttonFound: false, 
          availableButtons: buttons.map(b => b.textContent.trim()) 
        };
      }
    });
    console.log('🎯 Click result:', clickResult);
    
    // Wait and check if anything changed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Checking state after click...');
    const afterClick = await page.evaluate(() => {
      const roundText = document.querySelector('.text-central-700')?.textContent;
      const statusText = document.querySelector('.font-medium')?.textContent;
      return { roundText, statusText };
    });
    console.log('📊 After click state:', afterClick);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testStoreDirectly();