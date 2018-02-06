async function api(obj, state) {
  let response = await fetch(obj.url, {
    method: obj.method,
    body: JSON.stringify(obj.body),
    headers: new Headers({
      'authorization': `Bearer ${state.user.authorization}`,
      'Content-type': 'application/json',
      _id: obj._id || null
    })
  })

  return await response.json()
}

export default api