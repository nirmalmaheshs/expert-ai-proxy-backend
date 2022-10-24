import { Client } from "@opensearch-project/opensearch"

var host = process.env.HOST_NAME
var protocol = "https";
var username = process.env.USERNAME
var password = process.env.PASSWORD

var client = new Client({
  node: protocol + "://" + username + ":" + password + "@" + host
});

export class OpenSearchUtils{

    async insert_doc(documents){
          let response = await client.helpers.bulk({
            datasource: documents,
            onDocument (doc) {
              return {
                create: { _index: 'hate_speech'}
              }
            }
          })
        return JSON.stringify(response)
    }
}
