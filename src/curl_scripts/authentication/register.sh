#!/bin/bash
# Prettifies the json response while showing the header in the cURL response

clear
PORT=1024

USERNAME="Ebuka"
DATA="{
	\"first_name\"	    :\"$USERNAME\",
	\"last_name\"	    :\"Eze\",
	\"initials\"	    :\"EE\",
	\"email\"			:\"ebukachibueze5489@gmail.com\",
	\"phone\"			:\"2349063459623\",
	\"password\"		:\"EbukaDa1!\",
	\"ip_address\"		:\"168.89.91.45\",
	\"country\"			:\"nigeria\",
	\"dob\"				:\"1999-07-01\"
}"
URL=localhost
ROUTE=api/v1/auth/register
RES=$(curl\
	-i "$URL:$PORT/$ROUTE"\
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
echo $TOKEN > token/$USERNAME.txt

