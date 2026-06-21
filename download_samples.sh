#!/bin/bash
# download_samples.sh
# Reads download_urls.txt (format: <target_path> <url>) and downloads each file.

SETTINGS_FILE="download_urls.txt"
if [ ! -f "$SETTINGS_FILE" ]; then
  echo "Error: $SETTINGS_FILE not found. Please create it with lines: <target_path> <url>"
  exit 1
fi

while IFS= read -r line || [[ -n "$line" ]]; do
  # Skip empty lines or comments
  [[ -z "$line" ]] && continue
  [[ "$line" =~ ^# ]] && continue
  # Expect two fields: target_path url
  target=$(echo "$line" | awk '{print $1}')
  url=$(echo "$line" | awk '{print $2}')
  if [ -z "$target" ] || [ -z "$url" ]; then
    echo "Invalid line: $line"
    continue
  fi
  echo "Downloading $url -> $target"
  curl -L -o "$target" "$url"
  if [ $? -ne 0 ]; then
    echo "Failed to download $url"
  fi
done < "$SETTINGS_FILE"

echo "Download completed."
