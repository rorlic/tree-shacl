#!/bin/bash
rm -rf ./temp
mkdir -p ./temp

# create combined shapes files
cd ./src
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-common.txt) > ../temp/tree-common-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-root-node.txt) > ../temp/tree-root-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-structure.txt) > ../temp/tree-structure-shapes.ttl
cd ..

# create package
mkdir -p ./dist
cd temp
zip ../dist/tree-shapes.zip *
cd ..
