const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'dark',reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message)); page.on("console",m=>{if(m.type()==="warning" || m.type()==="error") console.log("browser:",m.text())});
 await page.goto(process.env.TEST_URL || 'http://127.0.0.1:8766');
 await page.waitForTimeout(800);
 console.log('initial',await page.evaluate(()=>({lessons:document.querySelectorAll('.topic').length,resources:document.querySelectorAll('.resource-card').length,stats:[...document.querySelectorAll('.count')].map(n=>n.textContent)})),errors);
 assert.equal(await page.locator('.topic').count(),84);
 assert.equal(await page.locator('.resource-card').count(),11);
 assert.equal(await page.locator('#globeFallback').isVisible(),false,'WebGL should be active');
 fs.mkdirSync('/tmp/perimetro-qa',{recursive:true});
 await page.screenshot({path:'/tmp/perimetro-qa/dark-desktop.png'});
 // Sample screenshot pixels rather than readPixels after the drawing buffer is discarded.
 for(const theme of ['light','dark','light','dark']){
   await page.locator('#themeBtn').click();
   assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
   await page.waitForTimeout(120);
   assert.equal(await page.locator('#globe').isVisible(),true);
 }
 await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('#continueBtn').click();
 assert.equal(await page.locator('#lesson-0-0 .ttitle').getAttribute('aria-expanded'),'true');
 await page.locator('#c0-0').check();
 await page.reload();assert.equal(await page.locator('#c0-0').isChecked(),true);
 await page.locator('#continueBtn').click();assert.equal(await page.locator('#lesson-0-1 .ttitle').getAttribute('aria-expanded'),'true');
 await page.locator('#topicSearch').fill('restauracao');
 assert.ok(await page.locator('.topic:visible').count()>0);
 await page.locator('#topicSearch').fill('zzzzzz-no-result');
 assert.equal(await page.locator('.mod:visible').count(),0);
 assert.match(await page.locator('#searchStatus').textContent(),/Nenhuma/);
 await page.locator('#topicSearch').fill('');assert.equal(await page.locator('.mod:visible').count(),6);
 await page.locator('#resourceType').selectOption('Livro');assert.equal(await page.locator('.resource-card').count(),3);
 await page.locator('#resourceLang').selectOption('PT-BR');assert.equal(await page.locator('.resource-card').count(),1);
 await page.locator('.resource-card button').click();
 await page.reload();
 await page.locator('#savedOnly').check();assert.equal(await page.locator('.resource-card').count(),1);
 await page.locator('.resource-card button').click();assert.equal(await page.locator('.resource-card').count(),0);
 await page.locator('#savedOnly').uncheck();
 await page.locator('#resourceSearch').fill('zzzz');assert.equal(await page.locator('.resource-card').count(),0);
 await page.locator('#resourceSearch').fill('');
 await page.locator('#recursos').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/perimetro-qa/library.png'});
 const downloadPromise=page.waitForEvent('download');await page.locator('#exportBtn').click();
 const download=await downloadPromise;await download.saveAs('/tmp/perimetro-qa/progresso.json');
 assert.equal(JSON.parse(fs.readFileSync('/tmp/perimetro-qa/progresso.json','utf8')).total_aulas,84);
 for(const width of [375,768,1440]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
   if(width===375){
     await page.locator('#menuBtn').click();assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'),'true');
     await page.locator('#mainNav a[href="#recursos"]').click();assert.equal(await page.locator('#menuBtn').getAttribute('aria-expanded'),'false');
     await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/perimetro-qa/mobile.png'});
   }
 }
 await page.locator('#themeBtn').click();await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);await page.screenshot({path:'/tmp/perimetro-qa/light-desktop.png'});
 // OWASP faces must occupy the card and keep all text readable on both sides.
 assert.equal(await page.locator('.flip').count(),10);
 for(const card of await page.locator('.flip').all()){
   await card.click();assert.equal(await card.getAttribute('aria-pressed'),'true');
   assert.equal(await card.locator('.back').getAttribute('aria-hidden'),'false');
   for(const face of await card.locator('.face').all()){
     assert.ok(await face.evaluate(n=>n.clientWidth>250 && n.clientHeight>=200 && n.scrollHeight<=n.clientHeight+1 && n.scrollWidth<=n.clientWidth+1));
   }
   await card.focus();await page.keyboard.press('Enter');
   assert.equal(await card.getAttribute('aria-pressed'),'false');
 }
 // No WebGL support should retain a visible, theme-aware globe.
 const fallback=await browser.newPage({colorScheme:'dark'});
 await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:get.call(this,type,...args)};});
 await fallback.goto(process.env.TEST_URL || 'http://127.0.0.1:8766');
 assert.equal(await fallback.locator('#globeFallback').isVisible(),true);
 assert.equal(await fallback.locator('#globe').isVisible(),false);
 // Preserve previous completion keys after curriculum additions.
 await fallback.evaluate(()=>localStorage.setItem('perimetro.v2',JSON.stringify({done:{'0-11':1,'5-11':1},quiz:{'0':1}})));
 await fallback.reload();assert.equal(await fallback.locator('#c0-11').isChecked(),true);assert.equal(await fallback.locator('#c5-11').isChecked(),true);
 assert.deepEqual(errors,[]);
 console.log('PASS: themes, 84 lessons, progress, search, 11 resources, saved items, export, responsive navigation, WebGL fallback, legacy progress; no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
