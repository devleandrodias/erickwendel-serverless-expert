gm identify -v verbose ./app/resource/homer.jpg

gm convert \
  ./app/resource/homer.jpg \
  -font ./app/resource/impact.ttf \
  -pointsize 50 \
  -fill "#FFF" \
  -stroke "#000" \
  -strokewidth 1 \
  -draw "gravity center text 0,155" \