import ggg from './db/db'

function func1() {
  return 1
}

function func2() {
  return 2
}

async function name() {
  const one = await func1()
  const two = await func2()
  if (one === 1 && two === 2) {
    await ggg.connect()
    const findOne = await ggg.findAllTodos()
    console.log(findOne)

    // setTimeout(async () => {
      // const findOne = await ggg.findAllTodos()
      // console.log(findOne)
    // }, 4000);
  }
}

name()