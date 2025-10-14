#!/usr/bin/env python3
import re

# Read the file
with open('/Users/apple/Music/linkistnfc-main 3oct2025 10.31Am 3/app/profiles/builder/page.tsx', 'r') as f:
    content = f.read()

# Pattern to match toggle switches with text inside the label
# This pattern looks for:
# 1. <label className="flex items-center gap-2...">
# 2. <input ... className="sr-only peer" />
# 3. <div ... peer-checked:bg-green-600"></div>
# 4. <span ...>Some text</span>
# 5. </label>

pattern = r'(<label className="flex items-center gap-2[^>]*>)\s*(<input\s+[^>]*className="sr-only peer"[^>]*/>)\s*(<div className="relative w-11 h-6[^>]*peer-checked:bg-green-600"></div>)\s*(<span[^>]*>.*?</span>)\s*(</label>)'

def replace_toggle(match):
    input_tag = match.group(2)
    toggle_div = match.group(3)
    span_text = match.group(4)

    # Create the new structure with separated label and text
    return f'''<div className="flex items-center gap-2 mt-2">
                              <label className="flex items-center cursor-pointer">
                                {input_tag}
                                {toggle_div}
                              </label>
                              {span_text}
                            </div>'''

# Replace all occurrences
new_content = re.sub(pattern, replace_toggle, content, flags=re.DOTALL)

# Write back
with open('/Users/apple/Music/linkistnfc-main 3oct2025 10.31Am 3/app/profiles/builder/page.tsx', 'w') as f:
    f.write(new_content)

print("✅ Fixed all toggle labels!")
