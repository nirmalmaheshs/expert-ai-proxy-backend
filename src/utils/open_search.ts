import { Client } from "@opensearch-project/opensearch"

var host = process.env.HOST_NAME
var protocol = "https";
var username = process.env.USERNAME
var password = process.env.PASSWORD

var client = new Client({
  node: protocol + "://" + username + ":" + password + "@" + host
});

export class OpenSearchUtils{

    async insert_doc(documents, indexName){
          let response = await client.helpers.bulk({
            datasource: documents,
            onDocument () {
              return {
                create: { _index: indexName}
              }
            }
          })
        return JSON.stringify(response)
    }
}
