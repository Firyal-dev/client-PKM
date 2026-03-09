const fs = require('fs');
const path = require('path');

const dir = '/home/kyura/website/PKL/pkm-v6/c/services';
const filesToProcess = [
    'puskesmas-info-service.ts',
    'visitor/visitor-service.ts',
    'video/video-service.ts',
    'static-page/static-page-service.ts',
    'review/review-service.ts',
    'news/news-service.ts',
    'menu/menu-service.ts',
    'page/page-service.ts',
    'gallery/gallery-service.ts',
    'album/album-service.ts',
    'agenda/agenda-service.ts'
];

for (const file of filesToProcess) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('getTenantHeader')) {
        if (content.match(/import\s+\{[^}]*\}\s+from\s+['"]@\/services\/helpers['"]/)) {
            content = content.replace(/(import\s+\{[^}]*)(\}\s+from\s+['"]@\/services\/helpers['"])/, '$1, getTenantHeader $2');
        } else {
            content = content.replace(/'use server'/, "'use server'\nimport { getTenantHeader } from '@/services/helpers'");
        }
    }

    content = content.replace(/fetch\(([^,]+),\s*\{/g, (match, url) => {
        // If it already has headers: getTenantHeader(), skip it
        if (match.includes('getTenantHeader')) return match;
        return `fetch(${url}, {\n            headers: getTenantHeader(),`;
    });

    content = content.replace(/fetch\(([^,}]+)\)\.then/g, (match, url) => {
        return `fetch(${url}, { headers: getTenantHeader() }).then`;
    });

    fs.writeFileSync(filePath, content);
    console.log('Processed', file);
}
console.log('Script completed successfully');
