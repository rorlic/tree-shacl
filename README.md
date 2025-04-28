# TREE specification SHACL
> This repository is still _work in progress_ and needs to be approved and accepted by the [TreeCG](https://github.com/treecg) community group, so use at your own risk.
>
> Currently the shapes cover only the requirements in **bold** (that is, the part that can be validates with shapes).

In order to be compliant with the [TREE hypermedia specification](https://treecg.github.io/specification/) a producer can publish a web API that allows to access the members of a dataset (`tree:Collection`) using a number of pages (`tree:Node`) interlinked through relationships (`tree:Relation`), which together create a search tree. This  allows customers of the API to efficiently retrieve (parts of) the dataset. Both the web API producer and consumer must comply to certain requirements.

This repository contains a number of [SHACL](https://www.w3.org/TR/shacl/) shapes that can be used to validate that the pages of a web API  are compliant to the TREE specification. The shapes help to validate a set of requirements that have been extracted from the TREE specification as it currently stands (Draft Community Group Report, 20 March 2025).

The shapes can be found in the [src](./src/) directory and are split into 4 files:
* the [base shapes](./src/tree-base-shapes.ttl) file contains shapes to validate pages of a TREE web API that provides only simple tree traversal (no pruning)
* the [advanced shapes](./src/tree-advanced-shapes.ttl) file contains additional shapes needed to validate a TREE web API that allows to prune the search tree
* in addition, you need either the [root node shapes](./src/tree-root-node-shapes.ttl) or the [non-root node shapes](./src/tree-non-root-node-shapes.ttl) to validate the first page respectively all other pages

This repository also contains a set of unit tests that check the correctness of the above shape files. To run the tests you need to install the required packages:
```bash
npm i
```
and then you can run the tests with:
```bash
npm run gui-test
```
or without an user interface:
```bash
npm test
```

## Producer Requirements:
Definitions:
* a _client_ is any human or system user that requests nodes
* a _page_ is the API response of a request for a node
* a _root page_ of a collection is the first page, which allows to retrieve all the members of the collection by following all the relation links
* a _focus node_ is a subject from which all the quads of a member can be retrieved and extracted (by the [member extraction algorithm](https://treecg.github.io/specification/#member-extraction-algorithm)) -- see also [here](https://w3c.github.io/data-shapes/shacl/#focusNodes)

### Page Requirements (TPPR)
1. the Web API MUST use HTTP(S) as its protocol
2. every page MUST contain linked data in a (commonly used) [RDF serialization format](https://en.wikipedia.org/wiki/Resource_Description_Framework#Serialization_formats)
3. every page MUST be directly or indirectly (by redirection) the result of a API request for a node
4. **a page MUST contain exactly one `tree:Node` whose subject is an URL** and, vice-versa, this page is the result of requesting this URL
5. **a page MUST contain a collection, which is a `tree:Collection`**
6. **in a root page, a collection MUST refer using its `tree:view` property to this `tree:Node`**
7. **in a non-root page, a collection MAY refer using its `tree:view` property to this `tree:Node`**
8. a page MAY link to one or more other pages that can be navigated to from the current page
9. a page MUST NOT be reachable from more than one page
10. a page MUST NOT contain a link to itself
11. **for every page that can be navigated to, a `tree:Node` MUST refer using a `tree:relation` property to a `tree:Relation` or sub-class thereof**
12. **a relation (`tree:Relation` or sub-class thereof) MUST refer using its `tree:node` property to a page that can be navigated to from the current page**
13. **a specific relation (`?relation a ?type` and `?type rdfs:subClassOf tree:Relation`) MUST include a `tree:path` property** to specify a [property path](https://www.w3.org/TR/shacl/#x2.3.1-shacl-property-paths) that defines how to find a member's value for comparison with its `tree:value` property
14. **a specific relation MUST refer using its `tree:value` property to the (literal or URI) value used for comparing with a member's value found by its `tree:path` property**
15. a specific relation defines an implicit comparison which MUST constraint the members that can be reached by following the relation link
16. a specific relation for string matching (`tree:PrefixRelation`, `tree:SubstringRelation`, `tree:PostfixRelation`, `tree:EqualToRelation`, and `tree:NotEqualToRelation`) MUST use unicode canonical equivalence for string matching
17. if a relation value (`tree:value`) is a language-tagged string (contains a language indication), the relation MUST only apply to property values tagged with the same language
18. if a relation value (`tree:value`) is not a language-tagged string, the relation MUST apply to all property values, both untagged as well as tagged with the any language
19. if a `tree:SubstringRelation` has multiple values (`tree:value`) set, members found by following the relation link MUST match all the given substrings
20. a specific relation of type `tree:GreaterThanRelation`, `tree:GreaterThanOrEqualToRelation`, `tree:LessThanRelation` and `tree:LessThanOrEqualToRelation` MUST use case sensitive unicode ordering for comparing strings
21. a specific relation of type `tree:GreaterThanRelation`, `tree:GreaterThanOrEqualToRelation`, `tree:LessThanRelation` and `tree:LessThanOrEqualToRelation` MUST use the [SPARQL order by logic](https://www.w3.org/TR/sparql11-query/#modOrderBy) for comparing URIs
22. a specific relation of type `tree:GreaterThanRelation`, `tree:GreaterThanOrEqualToRelation`, `tree:LessThanRelation`, `tree:LessThanOrEqualToRelation`, `tree:EqualToRelation`, and `tree:NotEqualToRelation` MUST compare time literals as `xsd:date`, `xsd:dateTime` _and_ `xsd:dateTimeStamp` and, if no timezone is specified then TODO
23. a specific relation of type `tree:GeospatiallyContainsRelation` MUST include a `tree:path` property to specify a WKT (Well-Known Text) literal of a member
24. **a specific relation of type `tree:GeospatiallyContainsRelation` MUST include a `tree:value` property to specify a WKT literal, which defines a geospatial region that, for all the members that can be found by following the link, geospatially [contains](https://en.wikipedia.org/wiki/DE-9IM#Spatial_predicates) the spatial object defined by the member's WKT literal value**
25. if for a relation the evaluation of a property path results in multiple values, a member MUST be available by following the link if the comparator matches at least one of these values (`logical OR`)
26. if multiple specific relations exists with the same link, a member MUST be available by following the link only if all the comparators are matched (`logical AND`)
27. a `tree:Node` MAY refer using its `tree:search` property to a `hydra:IriTemplate`, which allows to navigate from the current page to a specific page by a search form based on [hydra](https://www.hydra-cg.com/spec/latest/core/)
28. a `hydra:IriTemplate` MAY refer to a page using its `hydra:template` property and use its `hydra:mapping` to a `hydra:IriTemplateMapping`, which for its `hydra:property` uses `tree:longitudeTile`, `tree:latitudeTile` and `tree:zoom` as values, so that members can be found in that [slippy map tile](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)
29. a `hydra:IriTemplate` MAY refer to a page using its `hydra:template` property and use its `hydra:mapping` to a `hydra:IriTemplateMapping`, which for its `hydra:property` uses `tree:timeQuery` and a `tree:path` property (path) is added referring to a member property, so that members can be found for which the property matches the given time-query value

### Collection Requirements (TPCR)
1. **a collection MUST refer using its `tree:member` property to a member's focus node for all (zero or more) members available in the page**
2. **a collection MUST be identified using a named node (and not a blank node)**
3. **a collection MAY refer using its `tree:shape` property to one [node shape](https://w3c.github.io/data-shapes/shacl/#node-shapes)**
4. if a collection has a node shape, it MUST have a SHACL [shape target](https://w3c.github.io/data-shapes/shacl/#targets) that targets all members of the collection, i.e. all members adhere to that SHACL shape

## Consumer Requirements

### Initialization (TCIR)
1. a client MUST be initialized with a URL
2. a client MUST dereference the URL it is initiated with and parse the resulting (immediate or redirected) response (initial page)
3. if a triple `?c tree:view ?n` exists in the above response AND ?n matches the (last) redirected URL, then a client MUST assume that ?n is the URI of the root node and ?c is the URI of the collection
4. if a triple `?c tree:view ?n` exists in the above response AND ?c matches the initial URL before any redirection AND there is only one such triple, then a client MUST assume that ?n is the root node and ?c is the collection URI
5. a client MUST dereference the root node ?n (if not yet done), which results in the root node page, and combine the quads returned in both pages (initial page and root node page)

### Member Extraction (TCER)
1. a client MUST use the [member extraction algorithm](https://treecg.github.io/specification/#member-extraction-algorithm) to collect all the triples that belong to a member

### Search Tree Traversal (TCTR)
1. a client MUST find all the relations (`?node tree:Relation ?relation`) in the current page
2. if a relation is of a generic type (`?relation a tree:Relation`), a client MUST request the link (`?relation tree:node ?link`) found in that relation
3. a client MUST follow redirects when requesting a link
4. a client MUST assume that all members have been retrieved after dereferencing all node links
5. a client SHOULD keep a list of visited pages to detect faulty search trees (i.e. with pages containing more than one incoming link)

### Subtree Pruning (TCPR)
1. if a relation is of a specific type (`?relation a ?type` and `?type rdfs:subClassOf tree:Relation`), a client MAY decide to not request the relation link in order to prune the subtree reachable by following the link
2. a client MUST interpret a specific type of relation as a comparator `lhs operator rhs`, where
   1. the right hand side (rhs) defines the value (`?relation tree:value ?value`) to compare to, 
   2. the operator is implicitly defined by the [relation type](https://treecg.github.io/specification/#relationsubclasses) and 
   3. the left hand side (lhs) are the members reachable by following the relation link, that is, the members whose property value satisfies the comparator, where the property can be found by applying the relation property path (`tree:path`) to that member
3. if a property value is missing for a comparator, a client MAY have another way of retrieving that property
4. a client MUST follow a `tree:GeospatiallyContainsRelation` link which [overlaps](https://en.wikipedia.org/wiki/DE-9IM#Spatial_predicates) with the client's geospatial region of interest
