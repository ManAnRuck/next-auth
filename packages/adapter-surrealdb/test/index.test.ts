import Surreal, { ExperimentalSurrealHTTP } from "surrealdb.js"
import { runBasicTests } from "utils/adapter"

import { config } from "./common"

const connectionString = "http://0.0.0.0:8000"
const namespace = "test"
const database = "test"
const username = "test"
const password = "test"

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal()
  try {
    await db.connect(`${connectionString}/rpc`, {
      namespace,
      database,
      auth: {
        username,
        password,
      },
    })
    resolve(db)
  } catch (e) {
    reject(e)
  }
})

runBasicTests(config(clientPromise))

const clientPromiseRest = new Promise<ExperimentalSurrealHTTP<typeof fetch>>(
  async (resolve, reject) => {
    try {
      const db = new ExperimentalSurrealHTTP({
        fetch,
      })

      await db
        .connect(`${connectionString}`, {
          namespace,
          database,
          auth: {
            username,
            password,
          },
        })
        .catch((e) => {
          // The connection failed
          console.error("Error: signin failed", e)
        })
      resolve(db)
    } catch (e) {
      reject(e)
    }
  }
)

// TODO: Revisit and fix this test - currently updateUser and deleteUser are failing.
runBasicTests(config(clientPromiseRest))
