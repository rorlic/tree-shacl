#!/bin/bash
mkdir -p ./temp
mkdir -p ./dist

# create individual shapes package
cd ./src
rm -f ../dist/tree-src-shapes.zip
zip -q ../dist/tree-src-shapes.zip *.ttl
cd ..

# create combined shapes files
rm -rf ./temp/*
cd ./src
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-common.txt) > ../temp/tree-common-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-node-collection.txt) > ../temp/tree-collection-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-node-root.txt) > ../temp/tree-root-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-node-subsequent.txt) > ../temp/tree-subsequent-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-structure.txt) > ../temp/tree-structure-shapes.ttl
cd ../temp
rm -f ../dist/tree-shapes.zip
zip -q ../dist/tree-shapes.zip *
cd ..
