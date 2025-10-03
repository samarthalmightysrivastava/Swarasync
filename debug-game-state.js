const puppeteer = require('puppeteer');

async function debugGameState() {
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
    await page.waitForSelector('button');
    
    console.log('🔍 Checking initial game state...');
    const initialState = await page.evaluate(() => {
      const statusText = document.querySelector('.font-medium')?.textContent;
      const roundText = document.querySelector('.text-central-700')?.textContent;
      return { statusText, roundText };
    });
    console.log('📊 Initial state:', initialState);
    
    console.log('🎯 Clicking Start button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      if (startBtn) startBtn.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔍 Checking game state after Start...');
    const afterStartState = await page.evaluate(() => {
      const statusText = document.querySelector('.font-medium')?.textContent;
      const roundText = document.querySelector('.text-central-700')?.textContent;
      const circle = document.querySelector('.cursor-pointer');
      return { 
        statusText, 
        roundText, 
        circleExists: !!circle,
        circleClasses: circle?.className || 'none'
      };
    });
    console.log('📊 After Start state:', afterStartState);
    
    console.log('🖱️ Testing mousedown on circle...');
    const mouseResult = await page.evaluate(() => {
      const circle = document.querySelector('.cursor-pointer');
      if (circle) {
        // Add temporary event listener to see if events fire
        let eventFired = false;
        circle.addEventListener('mousedown', () => {
          eventFired = true;
          console.log('🎯 Mousedown event fired!');
        });
        
        circle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
        return { 
          circleFound: true, 
          eventFired,
          statusAfterClick: document.querySelector('.font-medium')?.textContent
        };
      }
      return { circleFound: false };
    });
    console.log('🖱️ Mouse test result:', mouseResult);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Final state check...');
    const finalState = await page.evaluate(() => {
      const statusText = document.querySelector('.font-medium')?.textContent;
      return { statusText };
    });
    console.log('📊 Final state:', finalState);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
  
  await browser.close();
}

debugGameState();