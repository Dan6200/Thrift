#!/bin/bash
# Prettifies the json response while showing the header in the cURL response

clear
PORT=3000
USERNAME="daniel"
DATA="{
	\"email\": \"$USERNAME@gmail.com\",
	\"password\":\"Imdagoat\"
}"
URL=https://jobs-api-06-dan.herokuapp.com
ROUTE=api/v1/auth/login
RES=$(curl\
	-i "$URL/$ROUTE"\
	-H "content-type:application/json"\
	-d "$DATA")

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
TOKEN=$(jq -r '.token' <<< $BODY)
echo $TOKEN > curl_scripts/$USERNAME-token.txt
