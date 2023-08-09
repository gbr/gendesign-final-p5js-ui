#!/bin/bash

# Initialize the counter variable
count=0

# Loop over all jpg files with leading zeros in the current directory
for file in image0*.jpg; do
  # Check if the file exists and is a regular file
  if [ -f "$file" ]; then
    # Increment the counter variable
    ((count++))
    # Remove the leading zeros from the file name
    newfile=${file##*0}
    # Rename the file to imageX.jpg, where X is the number without leading zeros
    mv -n "$file" "$newfile"
  fi
done

