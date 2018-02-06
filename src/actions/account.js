async function account(obj) {
  let response = await fetch(obj.url, {
    method: obj.method,
    headers: new Headers({
      'Content-type': 'application/json'
    }),
    body: obj.body
  })

  return await response.json()
}

export default account