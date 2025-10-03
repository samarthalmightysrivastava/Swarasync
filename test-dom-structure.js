const puppeteer = require('puppeteer');

async function checkDOMStructure() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Loading page...');
    await page.goto('https://3000-i7grkd9sf5yeu3rk3ze8s-6532622b.e2b.dev/play');
    await page.waitForSelector('button');
    
    console.log('🎯 Clicking Start...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.trim() === 'Start');
      if (startBtn) startBtn.click();
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔍 Checking DOM structure...');
    const domInfo = await page.evaluate(() => {
      // Find all text elements
      const allTextElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.trim() && el.children.length === 0
      );
      
      const textInfo = allTextElements.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        classes: el.className
      }));
      
      // Specifically look for round info
      const possibleRoundElements = Array.from(document.querySelectorAll('span, div')).filter(el =>
        el.textContent && (
          el.textContent.includes('Round') || 
          el.textContent.includes('/') ||
          el.textContent.includes('Central') ||
          el.textContent.includes('Press to Begin')
        )
      );
      
      const roundInfo = possibleRoundElements.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        classes: el.className
      }));
      
      return { textInfo: textInfo.slice(0, 20), roundInfo };
    });
    
    console.log('📊 Round-related elements:', JSON.stringify(domInfo.roundInfo, null, 2));
    console.log('📊 All text elements (first 20):', JSON.stringify(domInfo.textInfo, null, 2));
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
  
  await browser.close();
}

checkDOMStructure();