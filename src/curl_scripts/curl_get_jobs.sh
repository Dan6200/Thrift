#!/bin/bash
# Prettifies the cURL json response while showing the header

clear
ID=
PORT=3000
QUERY=
USERNAME=tevon
TOKEN=$(<curl_scripts/$USERNAME-token.txt)
URL=https://jobs-api-06-dan.herokuapp.com
ROUTE=api/v1/jobs
RES=$(curl -i "$URL/$ROUTE/$ID"\
	-H "content-type:application/json"\
	 -H "Authorization: Bearer $TOKEN")
HEAD=$''
BODY=$''
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
JSONRES=$(jq '.jobs' <<< $BODY)
if [ "$JSONRES" != "null" ]
then
	printf "$USERNAME\n================\n$JSONRES\n\n" >> curl_scripts/curlresget.txt
fi
