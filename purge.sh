#!/bin/bash

url_arr=(
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/Comfort-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/FVW-Audi-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/FVW-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/SVW-Joiner.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/Simple.js'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/comfort-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/fvw-audi-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/fvw-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/simple-theme.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/svw-version.json'
  'https://purge.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/themes.json'
)

for ((i = 1; i < ${#url_arr[*]}; i++)); do
  curl ${url_arr[$i]}
done
