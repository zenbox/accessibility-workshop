#\!/bin/bash

# Format HTML Tags in Markdown files
for file in $(find docs -name "*.md"); do
  echo "Processing $file..."
  
  # Format HTML tags - converts <tag> to `<tag>`
  perl -i -pe 's/(<[a-zA-Z][a-zA-Z0-9]*(?:\s+[^>]*)?>\s*<\/[a-zA-Z][a-zA-Z0-9]*>)/`\1`/g' "$file"
  perl -i -pe 's/(<[a-zA-Z][a-zA-Z0-9]*(?:\s+[^>]*)?\/?>)/`\1`/g' "$file"
  
  # Format attributes like role="heading"
  perl -i -pe 's/([a-zA-Z-]+="[^"]*")/`\1`/g' "$file"
  
  # Format HTML element references
  perl -i -pe 's/([a-zA-Z-]+)-Element/`\1`-Element/g' "$file"
  
  # Fix double backticks to prevent over-formatting
  perl -i -pe 's/``([^`]+)``/`\1`/g' "$file"
  
  # Don't format inside code blocks
  perl -i -0777 -pe 's/(```[^`]*```)/CODEBLOCK_PLACEHOLDER/g; s/CODEBLOCK_PLACEHOLDER/\1/g' "$file"
done

echo "Done formatting HTML tags in Markdown files."
