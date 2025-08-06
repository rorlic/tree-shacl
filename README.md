# TREE specification SHACL
> [!WARNING]
> This repository is still _work in progress_ and needs to be approved and accepted by the [TreeCG](https://github.com/treecg) community group, so use at your own risk.
> 
> Currently, not all requirements are covered by shapes and their tests. In addition, some requirements are hard to validate using SHACL or simply cannot be validated by shapes.

In order to be compliant with the [TREE hypermedia specification](https://treecg.github.io/specification/) a producer can publish a web API that allows to access the members of a dataset (`tree:Collection`) using a number of pages (`tree:Node`) interlinked through relationships (`tree:Relation`), which together create a search tree. This  allows customers of the API to efficiently retrieve (parts of) the dataset. Both the web API producer and consumer must comply to certain requirements.

This repository contains a number of [SHACL](https://www.w3.org/TR/shacl/) shapes that can be used to validate that the pages of a web API are compliant to the TREE specification. The shapes help to validate a set of [requirements](./requirements.md) that have been extracted from the TREE specification as it currently stands (Draft Community Group Report, 20 June 2025).

## Deliverables
The shapes can be found in the [src](./src/) directory and are split into a [common shapes](./src/tree-common.ttl) file and a file per requirement. Each requirement shape file has its own test and collection of test files and can be found in the [tests](./tests/) directory. There is also a [build](./build/) directory that contains a build script and some support text files to create the following combined shape files (which only exist after creating a build using the [script](./build/create-release.sh)):
* the [root node shapes](./temp/tree-root-node-shapes.ttl) file contains shapes needed to validate a root page response
* the [subsequent node shapes](./temp/tree-subsequent-node-shapes.ttl) file contains shapes needed to validate a subsequent page response
* the [collection shapes](./temp/tree-collection-node-shapes.ttl) file contains shapes needed to validate a collection response
* the [structure shapes](./temp/tree-structure-shapes.ttl) file contains shapes to validate the structure of the TREE itself

> [!TIP]
> In order to verify the structure of a TREE collection we need to gather all the tree nodes (`a tree:Node`) and their relations (`a tree:Relation`) as well as the collection (`a tree:Collection`) from the root node and construct a graph that can be validated by the above structure shapes file.

## Run Unit Tests
To run the set of unit tests, which check the correctness of the requirement shape files, you first need to install the required packages:
```bash
npm i
```
after which you can run the tests with the following command:
```bash
npm run gui-test
```
or even without an user interface:
```bash
npm test
```

## Create Release
To build the combined shapes files (see [deliverables](#deliverables)), you can run the [build script](./build/create-release.sh) from the root of the repository using:
```bash
./build/create-release.sh
```
This will first create a [temporary](./temp/) directory and a [distribution](./dist/) directory. After that it creates a zip archive containing the individual requirement shape files to allow creating custom combined shapes files as well as a zip file containing the set of standard combined shapes files. You can find both archives in the [distribution](./dist/) directory.
