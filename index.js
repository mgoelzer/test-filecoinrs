import * as wasm from "./node_modules/@zondax/filecoin-signer";

function log(text) {
  document.getElementById("output").innerHTML += text + "\n";
}

// Derive public key and address from private key
var key = ""
let deriveButton = document.getElementById("derive-keys-btn")
let privateKeyField = document.getElementById("private-key-hex-textbox")
deriveButton.addEventListener("click",(thisEl, ev)=>{
  let keyOutput = document.getElementById("key-output")
  key = wasm.keyRecover("27067de53aedf1540a89337b1e2bb1fb2e1d5ecc361fac67272d6faa46b57bd9")//(privateKeyField.textContent)
  keyOutput.textContent =  `wallet address       = ${key.address}\n` + 
                           `public key (hex)     = ${key.public_hexstring}\n`
  document.getElementById("from-text-box").value = key.address
})

let jwt = document.getElementById('jwt-text-box')
let from = document.getElementById('from-text-box')
let to = document.getElementById('to-text-box')
let amt = document.getElementById('amt-text-box')
let method = document.getElementById('method-text-box')
let params = document.getElementById('params-text-box')
let nonce = document.getElementById('nonce-text-box')
let gasLimit = document.getElementById('gas-limit-text-box')
let gasPrice = document.getElementById('gas-price-text-box')

var unsigned_tx = {}

let okMakeSignedRequest = document.getElementById("generate-req-btn")
okMakeSignedRequest.addEventListener("click",(thisEl, ev)=>{
  key = wasm.keyRecover("27067de53aedf1540a89337b1e2bb1fb2e1d5ecc361fac67272d6faa46b57bd9")//(privateKeyField.textContent)

  var fromStr = from.value
  if (from.value.charAt(0)=='f') fromStr = "t" + fromStr.substring(1)

unsigned_tx = {
  "to": to.value,
  "from": fromStr,
  "nonce": parseInt(nonce.value,10),
  "value": amt.value,
  "gasprice": gasPrice.value,
  "gaslimit": parseInt(gasLimit.value,10),
  "method": parseInt(method.value,10),
  "params": params.value
}

log(`unsigned_tx = ${JSON.stringify(unsigned_tx, 0, 4)}`);

let signed_transaction = wasm.transactionSignLotus(unsigned_tx, key.private_hexstring)
let signed_transaction_json_str = JSON.stringify(signed_transaction,0,4)

log("<h2>signed transaction</h2>\n\n")
log(`${signed_transaction}`)
//log(signed_transaction_json_str)

//log("<h2>curl</h2>\n\n")
//log(`curl -X POST -H "Content-Type: application/json" \\`)
//log(`-H "Authorization: Bearer $(cat ~/lotus-token.admin)" \\`)
//log(`--data "{ \"jsonrpc\": \"2.0\", \"method\": \"Filecoin.MpoolPush\", \"params\": [${condensed_signed_tx}], \"id\": 100}" 'http://127.0.0.1:1234/rpc/v0'`)

})