#!/bin/bash
mkdir -p ./temp
mkdir -p ./dist

# create individual shapes package
cd ./src
zip ../dist/tree-src-shapes.zip *.ttl
cd ..

# create combined shapes files
rm -rf ./temp/*
cd ./src
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-common.txt) > ../temp/tree-common-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-root-node.txt) > ../temp/tree-root-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-structure.txt) > ../temp/tree-structure-shapes.ttl
cd ../temp
zip ../dist/tree-shapes.zip *
cd ..
