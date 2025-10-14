const fs = require('fs');
const filePath = 'app/profiles/builder/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match and replace toggle labels
// This will NOT match the ones we already fixed (those have cursor-pointer)
const pattern = /<label className="flex items-center gap-2">\s*<input\s+type="checkbox"\s+checked=\{[^}]+\}\s+onChange=\{[^}]+\}\s+className="sr-only peer"\s*\/>\s*<div className="relative[^>]+><\/div>\s*<span className="[^"]+">([^<]+)<\/span>\s*<\/label>/gs;

content = content.replace(pattern, (match, text) => {
  // Extract the checkbox props
  const checkboxMatch = match.match(/<input\s+type="checkbox"\s+(checked=\{[^}]+\})\s+(onChange=\{[^}]+\})\s+className="sr-only peer"/);
  const divMatch = match.match(/<div (className="relative[^>]+)><\/div>/);
  const spanMatch = match.match(/<span (className="[^"]+")>([^<]+)<\/span>/);
  
  if (checkboxMatch && divMatch && spanMatch) {
    const checked = checkboxMatch[1];
    const onChange = checkboxMatch[2];
    const divClass = divMatch[1];
    const spanClass = spanMatch[1];
    const spanText = spanMatch[2];
    
    return `<div className="flex items-center gap-2">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                ${checked}
                                ${onChange}
                                className="sr-only peer"
                              />
                              <div ${divClass}></div>
                            </label>
                            <span ${spanClass}>${spanText}</span>
                          </div>`;
  }
  return match;
});

fs.writeFileSync(filePath, content);
console.log('✅ Fixed all toggle labels!');
