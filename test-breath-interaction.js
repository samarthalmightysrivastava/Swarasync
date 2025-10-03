const puppeteer = require('puppeteer');

async function testBreathInteraction() {
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
    
    console.log('⏳ Waiting for page load...');
    await page.waitForSelector('button', { timeout: 10000 });
    
    console.log('🎯 Clicking Start button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      if (startBtn) startBtn.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for game to start
    
    console.log('👆 Testing breath circle interaction...');
    await page.evaluate(() => {
      const circle = document.querySelector('.cursor-pointer');
      if (circle) {
        console.log('✅ Found breath circle, simulating mousedown...');
        circle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
        setTimeout(() => {
          console.log('✅ Simulating mouseup...');
          circle.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        }, 1000);
      } else {
        console.log('❌ Breath circle not found');
      }
    });
    
    console.log('⏱️  Waiting 3 seconds for interaction response...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Test completed');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testBreathInteraction();