#!/usr/bin/env python3
import re

# Read the file
with open('/Users/apple/Music/linkistnfc-main 3oct2025 10.31Am 3/app/profiles/builder/page.tsx', 'r') as f:
    lines = f.readlines()

# Process line by line, looking for toggle patterns
i = 0
new_lines = []
while i < len(lines):
    line = lines[i]

    # Check if this line starts a toggle label pattern
    if '<label className="flex items-center gap-2' in line and 'cursor-pointer' not in line:
        # Store the indentation
        indent = len(line) - len(line.lstrip())
        indent_str = ' ' * indent

        # Check if next few lines contain sr-only peer (indicating a toggle switch)
        is_toggle = False
        for j in range(i, min(i + 10, len(lines))):
            if 'sr-only peer' in lines[j] and 'peer-checked:bg-green-600' in ''.join(lines[j:min(j+5, len(lines))]):
                is_toggle = True
                break

        if is_toggle:
            # This is a toggle switch that needs to be fixed
            # Collect all lines until </label>
            toggle_lines = [line]
            i += 1
            while i < len(lines) and '</label>' not in lines[i]:
                toggle_lines.append(lines[i])
                i += 1
            if i < len(lines):
                toggle_lines.append(lines[i])  # Include the </label> line

            # Extract the span text (last line before </label>)
            span_text = None
            for tl in reversed(toggle_lines[:-1]):
                if '<span' in tl:
                    span_text = tl.strip()
                    toggle_lines.remove(tl)
                    break

            # Reconstruct with new structure
            new_lines.append(f'{indent_str}<div className="flex items-center gap-2 mt-2">\n')
            new_lines.append(f'{indent_str}  <label className="flex items-center cursor-pointer">\n')

            # Add input and toggle div (skip the first <label> line and last </label> line)
            for tl in toggle_lines[1:-1]:
                if '<span' not in tl:  # Skip span lines
                    # Adjust indentation: add 2 spaces
                    stripped = tl.lstrip()
                    if stripped:
                        new_lines.append(f'{indent_str}    {stripped}')
                    else:
                        new_lines.append(tl)

            new_lines.append(f'{indent_str}  </label>\n')
            if span_text:
                new_lines.append(f'{indent_str}  {span_text}\n')
            new_lines.append(f'{indent_str}</div>\n')

            i += 1
            continue

    new_lines.append(line)
    i += 1

# Write back
with open('/Users/apple/Music/linkistnfc-main 3oct2025 10.31Am 3/app/profiles/builder/page.tsx', 'w') as f:
    f.writelines(new_lines)

print("✅ Fixed all remaining toggle labels!")
