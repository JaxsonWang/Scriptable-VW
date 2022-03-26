#!/bin/bash

url_arr=(
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/Comfort-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/FVW-Audi-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/FVW-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/SVW-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/Simple.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/comfort-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/fvw-audi-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/fvw-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/simple-theme.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/svw-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@master/build/themes.json'
)

for ((i = 1; i < ${#url_arr[*]}; i++)); do
  curl ${url_arr[$i]}
done
