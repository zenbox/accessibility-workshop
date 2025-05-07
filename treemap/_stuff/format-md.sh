#!/bin/bash

# Script to format HTML tags and code elements in Markdown files
# Usage: ./format-md.sh [directory]

# Default to docs directory if not specified
DIR="${1:-./docs}"

# Check if directory exists
if [ ! -d "$DIR" ]; then
  echo "Directory $DIR does not exist!"
  exit 1
fi

echo "Processing Markdown files in $DIR..."

# Function to process a single file
process_file() {
  local file="$1"
  local temp_file=$(mktemp)
  
  echo "Processing: $file"
  
  # Create a backup first
  cp "$file" "${file}.bak"
  
  # Process the file with a series of careful transformations
  cat "$file" | 
  # Skip already formatted code sections (between backticks)
  perl -pe 'BEGIN{undef $/;} s/```.*?```|`.*?`/\n<<CODEBLOCK>>\n/gs' |
  
  # Format HTML tags like <h1>, <div>, etc. with backticks
  perl -pe 's/<([a-zA-Z][a-zA-Z0-9]*(\s+[^>]*)?)>/`<\1>`/g' |
  perl -pe 's/<\/([a-zA-Z][a-zA-Z0-9]*(\s+[^>]*)?)>/`<\/\1>`/g' |
  
  # Format self-closing HTML tags like <br/>, <img/>, etc.
  perl -pe 's/<([a-zA-Z][a-zA-Z0-9]*(\s+[^>]*)?)\s*\/>/`<\1\/>`/g' |
  
  # Format ARIA attributes
  perl -pe 's/(role=("[^"]*"))/`\1`/g' |
  perl -pe 's/(aria-[a-zA-Z\-]+=("[^"]*"))/`\1`/g' |
  
  # Format HTML5 structural elements when they appear as standalone words
  perl -pe 's/\b(header|nav|main|footer|article|section|aside)\b(?![":`])/`\1`/g' |
  
  # Format element references with -Element suffix
  perl -pe 's/([a-zA-Z][a-zA-Z0-9]*)-Element/`\1`-Element/g' |
  
  # Format element references with -Elemente suffix (German plural)
  perl -pe 's/([a-zA-Z][a-zA-Z0-9]*)-Elemente/`\1`-Elemente/g' |
  
  # Format elements with surrounding parentheses
  perl -pe 's/\(([a-zA-Z][a-zA-Z0-9]*)-Element(s?)\)/(`\1`-Element\2)/g' |
  
  # Restore code blocks
  perl -pe 'BEGIN{undef $/;} s/\n<<CODEBLOCK>>\n/<<PLACEHOLDER>>/gs' |
  
  # Fix double backticks
  perl -pe 's/``([^`]+)``/`\1`/g' |
  
  # Remove backticks from within Markdown URLs [text](url)
  perl -pe 's/\(([^)]*)`([^`]*)`([^)]*)\)/(\1\2\3)/g' |
  
  # Restore original code blocks
  cat > "$temp_file"
  
  # Replace placeholders with original code blocks
  awk -v RS='<<PLACEHOLDER>>' -v ORS='' '
    NR==1 {print $0; next}
    {
      getline code < ARGV[1]
      sub(/\n<<CODEBLOCK>>\n/, code)
      print $0
    }
  ' "$temp_file" "$file" > "${file}.new"
  
  # Compare new file with original to check for issues
  if diff -q "${file}.new" "$file" > /dev/null; then
    echo "No changes made to $file"
    rm "${file}.new" "${file}.bak"
  else
    # Replace original with new version
    mv "${file}.new" "$file"
    echo "Successfully updated $file (backup saved as ${file}.bak)"
  fi
  
  rm "$temp_file"
}

# Process all Markdown files in the directory
find "$DIR" -name "*.md" | while read file; do
  process_file "$file"
done

echo "Processing complete!"