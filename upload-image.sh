#!/bin/bash
# Prettifies the json response while showing the header in the cURL response

clear
PORT=1024
# \"\":\"\"
DATA="{
}"
URL=http://localhost:1024
ROUTE=api/v1/user/vendor/products/33/media
ID=
TOKEN=$(<./server/src/token.txt)
RES=$(curl -i "$URL/$ROUTE/$ID"\
	-H "Authorization: Bearer $TOKEN"\
	-F "productMedia=@\"/home/darealestniqqa/Pictures/DEMON.jpg\""\
	-F "description=\"A wide bodied whip!\"")
HEAD=""
BODY=""
isJSON=false 
for (( i=0; i<${#RES}; i++)); do
	CH=${RES:$i:1}
	if [ "$CH" = '{' ] || [ "$CH" = '[' ] || [ $isJSON = true ]
	then
		BODY+=$CH
		isJSON=true
	else
		HEAD+=$CH
	fi
done
printf "\n\n$HEAD"
echo $BODY | jq '.'
