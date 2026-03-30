const fs = require('fs-extra');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const path = require('path');

// 웹사이트 URL을 정의합니다
const baseUrl = 'https://www.xn--vb0b67vepvv2b.com';

// 정적 라우트를 정의합니다
const routes = [
  '/',
  '/policy',
  '/courses',
  '/QnA',
  '/QnA/new',
];

async function generateSitemap() {
    const links = routes.map((route) => ({
      url: `${baseUrl}${route}`,
      changefreq: 'daily',
      priority: 0.7,
    }));
  
    const stream = new SitemapStream({ hostname: baseUrl });
  
    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
      data.toString()
    );
  
    // 현재 스크립트 위치에서 상대 경로로 파일을 저장합니다
    const filePath = path.join(__dirname, 'sitemap.xml');
    await fs.writeFile(filePath, xml);
    console.log(`Sitemap generated successfully at ${filePath}`);
  }
  
  generateSitemap();