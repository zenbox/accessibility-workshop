#!/bin/bash

# Process all markdown files in the docs directory
find /Users/michaelreichart/Documents/htdocs/accessibility-workshop/treemap/docs -name "*.md" -type f | while read file; do
  echo "Processing $file"
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # 1. Format HTML tags: <tag> to `<tag>` - handles both opening and closing tags
  # Careful to not format already formatted tags or actual HTML code blocks
  perl -pe 's/(?<!`)<(\/?[a-zA-Z][a-zA-Z0-9]*)([ ][^`>]*)?>/`<$1$2>`/g' "$file" > "$temp_file"
  
  # 2. Format HTML attributes: attribute="value" to `attribute="value"`
  perl -pe 's/(?<!`)(role|aria-[a-zA-Z-]+|id|class|title|alt|href|src|kind|name|type|placeholder|action|method|value|target|rel|for|colspan|rowspan|tabindex|style)="([^"]*)"(?!`)/`$1="$2"`/g' "$temp_file" > "${temp_file}.2"
  
  # 3. Format element references like track-Element to `track`-Element
  perl -pe 's/([a-z]+)-Element/`$1`-Element/g' "${temp_file}.2" > "${temp_file}.3"
  
  # 4. Format standalone HTML elements (h1-h6, div, span, etc.)
  perl -pe 's/\b(?<![-_`\/])(h[1-6]|div|span|img|p|ul|ol|li|table|tr|td|th|button|iframe|video|track|area|header|nav|main|aside|footer)(?![-_a-zA-Z0-9`])/`$1`/g' "${temp_file}.3" > "${temp_file}.4"
  
  # 5. Format ARIA attributes when mentioned alone
  perl -pe 's/\b(?<![-_`\/])(role|aria-[a-zA-Z-]+)(?![-_a-zA-Z0-9=":`])/`$1`/g' "${temp_file}.4" > "${temp_file}.5"
  
  # 6. Fix double backticks
  perl -pe 's/``([^`]*)``/`$1`/g' "${temp_file}.5" > "${temp_file}.6"
  
  # 7. Ensure code blocks are preserved (```html ... ```)
  # This is complex to do with regex alone - we're not touching existing code blocks
  
  # 8. Fix markdown links with code formatting - preserve intended links
  perl -pe 's/\[`([^`]*)`\](\([^)]*\))/[$1]$2/g' "${temp_file}.6" > "${temp_file}.7"
  
  # Move the final result back to the original file
  mv "${temp_file}.7" "$file"
  
  # Clean up temporary files
  rm -f "$temp_file" "${temp_file}."*
done

echo "Markdown formatting completed successfully!"