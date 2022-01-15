#!/bin/bash

cd /doc

function prepareSubmit() {
  node /work/add_nombre.js $1 /tmp/add_nombre.pdf
  echo "Add Nombre. done."

  # フォント埋め込み
  gs -q -dNOPAUSE -dBATCH -dPDFSETTINGS=/prepress -sDEVICE=pdfwrite \
    -dCompatibilityLevel=1.7 \
    -sOutputFile=/doc/$2 /tmp/add_nombre.pdf
  echo "Embedded Font. done."
}

function makeEbook() {
  node /work/make_ebook.js $1 $2 $3 $4
  echo "Make Ebook. done."
}

case "$1" in
"submission") echo "Preparing submission data"
  prepareSubmit $2 $3
  ;;
"ebook") echo "Preparing e-book data"
  makeEbook $2 $3 $4 $5
  ;;
*) echo "mode is submission or ebook"
  ;;
esac
