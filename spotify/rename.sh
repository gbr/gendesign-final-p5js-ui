#!/bin/bash

# Initialize the counter variable
count=0

# Loop over all jpg or jpeg files in the current directory
for file in *.jpeg; do
  # Check if the file exists and is a regular file
  if [ -f "$file" ]; then
    # Increment the counter variable
    ((count++))
    # Rename the file to imageX.jpg, where X is the number
    mv -n "$file" "image$count.jpg"
  fi
done

