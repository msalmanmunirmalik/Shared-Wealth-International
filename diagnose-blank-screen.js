import puppeteer from 'puppeteer';

async function diagnosePage() {
  console.log('🔍 Diagnosing blank page issue...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true
  });
  
  const page = await browser.newPage();
  
  const consoleMessages = [];
  const errors = [];
  
  // Capture console logs
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  // Capture errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Capture failed requests
  page.on('requestfailed', request => {
    errors.push(`Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });
  
  console.log('🌐 Navigating to http://localhost:8081...\n');
  
  try {
    await page.goto('http://localhost:8081', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if root element has content
    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        exists: !!root,
        innerHTML: root?.innerHTML || '',
        childCount: root?.children.length || 0,
        text: root?.textContent || '',
        isEmpty: !root?.innerHTML || root.innerHTML.trim() === ''
      };
    });
    
    console.log('📊 Root Element Analysis:');
    console.log(`  Exists: ${rootContent.exists}`);
    console.log(`  Is Empty: ${rootContent.isEmpty}`);
    console.log(`  Child Count: ${rootContent.childCount}`);
    console.log(`  Text Length: ${rootContent.text.length}`);
    console.log(`  HTML Preview: ${rootContent.innerHTML.substring(0, 200)}...\n`);
    
    // Check for errors
    if (errors.length > 0) {
      console.log('❌ Errors Found:');
      errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err}`);
      });
      console.log('');
    } else {
      console.log('✅ No page errors detected\n');
    }
    
    // Check console messages
    const errorMessages = consoleMessages.filter(m => m.type === 'error');
    const warningMessages = consoleMessages.filter(m => m.type === 'warning');
    
    if (errorMessages.length > 0) {
      console.log('❌ Console Errors:');
      errorMessages.forEach((msg, idx) => {
        console.log(`  ${idx + 1}. ${msg.text}`);
      });
      console.log('');
    }
    
    if (warningMessages.length > 0) {
      console.log('⚠️  Console Warnings:');
      warningMessages.slice(0, 5).forEach((msg, idx) => {
        console.log(`  ${idx + 1}. ${msg.text.substring(0, 100)}`);
      });
      console.log('');
    }
    
    // Check API connectivity
    const apiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8080/api/companies');
        const data = await response.json();
        return {
          success: response.ok,
          status: response.status,
          hasData: !!data
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('🔌 API Connectivity Test:');
    console.log(`  Success: ${apiTest.success}`);
    console.log(`  Status: ${apiTest.status || 'N/A'}`);
    if (apiTest.error) {
      console.log(`  Error: ${apiTest.error}`);
    }
    console.log('');
    
    // Take a screenshot
    await page.screenshot({ path: 'blank-screen-diagnostic.png', fullPage: true });
    console.log('📸 Screenshot saved: blank-screen-diagnostic.png\n');
    
    // Diagnosis
    console.log('═'.repeat(70));
    console.log('🎯 DIAGNOSIS:');
    console.log('═'.repeat(70));
    
    if (rootContent.isEmpty) {
      console.log('❌ BLANK SCREEN CONFIRMED');
      console.log('\nPossible Causes:');
      if (errors.length > 0 || errorMessages.length > 0) {
        console.log('  1. JavaScript errors preventing React from rendering');
        console.log('  2. Check the errors listed above');
      }
      if (!apiTest.success) {
        console.log('  3. Backend API not responding - frontend may be waiting');
      }
      console.log('  4. React component mounting issue');
      console.log('  5. Routing configuration problem');
    } else {
      console.log('✅ Page has content - may be a CSS/display issue');
      console.log(`\nContent found: ${rootContent.childCount} elements`);
    }
    console.log('═'.repeat(70));
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error.message);
  } finally {
    await browser.close();
  }
}

diagnosePage().catch(console.error);

