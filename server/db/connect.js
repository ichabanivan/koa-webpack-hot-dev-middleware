import { MongoClient } from 'mongodb'
import config from '../config'

export default new Promise((resolve, reject) => {
  MongoClient.connect(config.url, (err, client) => {
    if (err) reject(err)
    resolve(client)
  })
})
