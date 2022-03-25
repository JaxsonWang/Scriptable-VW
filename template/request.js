const request = new Request('https://cdn.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/simple-theme.json')
request.method = 'GET'
request.headers = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  Host: 'jaxsonwang.gitee.io'
}
console.log(request)
const response = await request.loadJSON()
console.log(response)

