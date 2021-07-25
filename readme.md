# Serverless Offline

[Serverless Offline](https://www.serverless.com/) is a Framework used to run serverless applications offline.

## Installation

Use npm to install [serverless offline](https://www.npmjs.com/package/serverless-offline).

```bash
npm install serverless-offline --save-dev
```

## Usage

In order to run it locally use this command
```bash
sls offline --stage dev --host 0.0.0.0
```

## To deploy your lambda in aws cloud use this command
``` bash
serverless deploy
```

This repo contains sample endpoints for hello world and to return the request that is given

## Curl for hello world

``` bash
curl --location --request GET 'http://localhost:3000/dev/hello' \
--header 'sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"' \
--header 'sec-ch-ua-mobile: ?0' \
--header 'content-type: application/json; charset=UTF-8' \
--header 'accept: application/json, text/plain, */*' \
--header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36' \
--header 'sec-fetch-site: cross-site' \
--header 'sec-fetch-mode: cors' \
--header 'sec-fetch-dest: empty' \
--header 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
```

## Curl for returning request as response

```bash
curl --location --request POST 'http://localhost:3000/dev/printRequest' \
--header 'sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"' \
--header 'sec-ch-ua-mobile: ?0' \
--header 'content-type: application/json; charset=UTF-8' \
--header 'accept: application/json, text/plain, */*' \
--header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36' \
--header 'sec-fetch-site: cross-site' \
--header 'sec-fetch-mode: cors' \
--header 'sec-fetch-dest: empty' \
--header 'accept-language: en-GB,en-US;q=0.9,en;q=0.8'
```