const puppeteer = require('puppeteer');

async function testGameClick() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('🖥️  BROWSER:', msg.text());
  });
  
  try {
    console.log('🌐 Navigating to game page...');
    await page.goto('https://3000-i7grkd9sf5yeu3rk3ze8s-6532622b.e2b.dev/play');
    
    console.log('⏳ Waiting for Start button...');
    await page.waitForSelector('button', { timeout: 10000 });
    
    console.log('🔍 Finding all buttons...');
    const buttonTexts = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => btn.textContent.trim());
    });
    
    console.log('🔍 Available buttons:', buttonTexts);
    
    const hasStartButton = buttonTexts.includes('Start');
    
    if (!hasStartButton) {
      console.log('❌ Start button not found in:', buttonTexts);
      throw new Error('Start button not found');
    }
    
    console.log('🎯 Clicking Start button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      if (startBtn) {
        console.log('✅ Found Start button, clicking...');
        startBtn.click();
      } else {
        console.log('❌ Start button not found during click');
      }
    });
    
    console.log('⏱️  Waiting 3 seconds for game response...');
    await page.waitForTimeout(3000);
    
    console.log('✅ Test completed');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testGameClick();