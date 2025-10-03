const puppeteer = require('puppeteer');

async function testElementClick() {
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
    
    console.log('🎯 Starting game...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      if (startBtn) startBtn.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Checking clickable elements...');
    const elementInfo = await page.evaluate(() => {
      const circle = document.querySelector('.cursor-pointer');
      const gameArea = document.querySelector('.aspect-square');
      
      if (!circle) return { error: 'No circle found' };
      
      const rect = circle.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(circle);
      const isVisible = rect.width > 0 && rect.height > 0;
      const hasPointerEvents = computedStyle.pointerEvents !== 'none';
      
      // Check if there are overlapping elements
      const elementsAtCenter = document.elementsFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      
      return {
        circleExists: true,
        isVisible,
        hasPointerEvents,
        zIndex: computedStyle.zIndex,
        position: computedStyle.position,
        bounds: { 
          left: rect.left, 
          top: rect.top, 
          width: rect.width, 
          height: rect.height 
        },
        elementsAtCenter: elementsAtCenter.map(el => el.className).slice(0, 5)
      };
    });
    
    console.log('📊 Element info:', JSON.stringify(elementInfo, null, 2));
    
    if (elementInfo.circleExists && elementInfo.isVisible) {
      console.log('🖱️ Attempting direct click at center...');
      
      const result = await page.evaluate(() => {
        const circle = document.querySelector('.cursor-pointer');
        if (circle) {
          const rect = circle.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Create and dispatch a mousedown event at the exact center
          const event = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY
          });
          
          circle.dispatchEvent(event);
          return { success: true, centerX, centerY };
        }
        return { success: false };
      });
      
      console.log('🎯 Click result:', result);
      
      // Wait and check result
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalState = await page.evaluate(() => {
        const statusElement = document.querySelector('.font-medium');
        return {
          status: statusElement?.textContent || 'Not found'
        };
      });
      
      console.log('📊 Final status:', finalState);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
}

testElementClick();