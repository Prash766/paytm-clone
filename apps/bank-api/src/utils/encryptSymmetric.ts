import crypto from "node:crypto";

 function encryptedToken(key :string, plainText:string) {
  const iv = crypto.randomBytes(12).toString("base64");
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  )
  console.log("cipher" , cipher)
  let cipherText = cipher.update(plainText, 'utf-8' , 'base64')
  cipherText +=cipher.final("base64")
  
  return cipherText 
}

export {
    encryptedToken
}
