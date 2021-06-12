#!/bin/bash

# Convert Joplin pages to Github.io
# Takes full path to GH md file
# Save all Joplin images to assets/img/
#Joplin link example: ![06cfc558fe03d8b0c3ed3ca3e3649822.png](:/588f963c54424e5a9fcd7022b7b6e532)

targetpage="$1"

if [[ "$1" == "" ]];then
	echo "Page path missing."
	echo "Usage: ./joplin2pages.sh </path/to/post.md>"
	exit
fi

imagelinks=($(cat $targetpage | grep "(:/"))
for imagelink in "${imagelinks[@]}"
do
	echo "LINK: $imagelink"
	filename=$(echo "$imagelink" | sed 's/\[/ /g' | sed 's/\]/ /g' | awk '{print $2}')
	tochange=$(echo "$imagelink" | sed 's/\[/ /g' | sed 's/\]/ /g' | sed 's@(:/@@g' | sed 's/)//g' | awk '{print $3}')
	echo "$filename => $tochange"
	sed -i "s@:/$tochange@./../../assets/img/$filename@g" "$targetpage"
done
