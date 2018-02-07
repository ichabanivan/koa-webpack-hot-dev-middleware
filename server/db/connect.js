import { MongoClient } from 'mongodb'
import config from '../config'

export default function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.url, (err, client) => {
      if (err) {
        reject(err)
      }
      resolve(client.db("todos"))
    })
  })
}
