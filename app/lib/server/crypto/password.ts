import { randomBytes, pbkdf2 } from "crypto"

/** The size of the password salt. */
const SALT_SIZE = 16
/** The number of iterations for the hash function. */
const HASH_ITERATIONS: number = 1000
/** The length of the generated key. */
const HASH_KEY_LEN: number = 64
/** The digest used to hash passwords. */
const HASH_DIGEST: string = "sha512"

/** Generates a salt of the given size in bytes. 16 by default. */
export function generateSalt(): Buffer {
  return randomBytes(SALT_SIZE)
}

/** Hashes a password with a given salt. */
export function hashPassword(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // hash the password
    pbkdf2(
      password,
      salt,
      HASH_ITERATIONS,
      HASH_KEY_LEN,
      HASH_DIGEST,
      (err, hashed) => {
        // if there was an error, reject this promise
        if (err) {
          return reject(err)
        }

        // otherwise resolve with hashed password
        resolve(hashed)
      },
    )
  })
}
