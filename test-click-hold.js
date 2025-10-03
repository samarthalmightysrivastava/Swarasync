const puppeteer = require('puppeteer');

async function testClickAndHold() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Loading page and starting game...');
    await page.goto('https://3000-i7grkd9sf5yeu3rk3ze8s-6532622b.e2b.dev/play');
    await page.waitForSelector('button');
    
    // Click Start
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      if (startBtn) startBtn.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('🔍 Checking state before breath interaction...');
    const beforeState = await page.evaluate(() => {
      return {
        statusText: document.querySelector('.font-medium')?.textContent,
        roundText: document.querySelector('.text-central-700')?.textContent,
      };
    });
    console.log('📊 Before:', beforeState);
    
    console.log('🖱️ Starting mousedown (hold)...');
    await page.evaluate(() => {
      const circle = document.querySelector('.cursor-pointer');
      if (circle) {
        circle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      }
    });
    
    // Wait a bit while "holding"
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('🔍 Checking state DURING hold...');
    const duringState = await page.evaluate(() => {
      return {
        statusText: document.querySelector('.font-medium')?.textContent,
        roundText: document.querySelector('.text-central-700')?.textContent,
      };
    });
    console.log('📊 During hold:', duringState);
    
    console.log('🖱️ Releasing (mouseup)...');
    await page.evaluate(() => {
      const circle = document.querySelector('.cursor-pointer');
      if (circle) {
        circle.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      }
    });
    
    // Wait for exhale phase
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Checking final state...');
    const afterState = await page.evaluate(() => {
      return {
        statusText: document.querySelector('.font-medium')?.textContent,
        roundText: document.querySelector('.text-central-700')?.textContent,
      };
    });
    console.log('📊 After release:', afterState);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testClickAndHold();