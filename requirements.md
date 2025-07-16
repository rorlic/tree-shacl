# TREE Requirements
> [!CAUTION]
> This is still work in progress.

This document contains a number of requirements related to the content of TREE nodes that can be verified using static analysis of such a content. As this content must be linked-data expressed in a commonly-used [RDF](https://www.w3.org/TR/rdf12-concepts/) serialization, the static analysis can be done by applying [SHACL](https://w3c.github.io/data-shapes/shacl/) validation on the content.

This document is based on [The TREE hypermedia specification, Draft Community Group Report, 20 June 2025](./The%20TREE%20hypermedia%20specification,%20Draft%20Community%20Group%20Report,%2020%20June%202025.pdf) and has the same structure to allow for easier maintenance.

## Definitions
* A *URI* ([Uniform Resource Identifier](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)) is a sequence of (ascii) characters identifying a physical or abstract resource/thing/entity.
* A *URL* ([Uniform Resource Locator](https://en.wikipedia.org/wiki/URL)) is a URI which also to locate a resource, in addition to identifying it.
* An *IRI* ([Internationalized Resource Identifier](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier)) is an extension of a URI allowing characters from the UCS ([Universal Coded Character Set](https://en.wikipedia.org/wiki/Universal_Coded_Character_Set)).
* A *collection* (`tree:Collection`) is a set of (zero or more) members which defines how a dataset is distributed across multiple pages interlinked through relationships.
* A *member* is a set of quad(s) defining an item in a dataset.
* A *triple* is a construct subject - predicate - object, which defines a (uni-directional) relation between  the subject (IRI) and the object (IRI or literal) semantically defined by the predicate (named IRI).
* A *quad* is a triple augmented with a graph (named IRI), which is a context identifier, allowing to group triples (in an arbitrary way).
* A *node* (`tree:Node`) is a page that is part of the (search) tree.
* A *root node* is the first (top) node of a search tree.
* A *subsequent node* is a node that is not a root node.
* A *relation* (`tree:Relation`) is a link between pages.
* A *constrained relation* is a specialized relation defining a constraint on the data items that can be found when following the link.
* A *geospatial constrained relation* is the specialized (`rdfs:subClassOf tree:Relation`) `tree:GeospatiallyContainsRelation` relation
* A *non-geospatial constrained relation* is a specialized (`rdfs:subClassOf tree:Relation`) relation different from a geospatial constrained relation
* A *collection response* is the HTTP response when dereferencing a collection identifier.
* A *page response* is the HTTP response when dereferencing a node in the search tree.
* A *SHACL shape* is a collection of rules based on SHACLE that allow to discover a data item's shape (its structure and properties) as well as validate data items (using target declarations).
* A *search form* (`hydra:IriTemplate`) is an entity describing a template and parameters, which allows to create a direct link to a page in the search tree.
* A *view description* is an entity containing any information relevant to the search tree as a whole.
* A *property path* is a [SHACL construct](https://w3c.github.io/data-shapes/shacl/#property-paths) to refer to a property of an entity.
* A *current page URL* is the final URL after all redirects when requesting a page.
* A *WKT* ([Well Known Text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)) is a text-based representation of a geometric object.

## 1. Overview
> [!NOTE]
> not applicable

## 2. Definitions
> [!NOTE]
> not applicable

## 3. Initialization
1. In a collection response, a collection MUST refer to one or more root nodes using a `tree:view` property[^1]
2. In a root page response, a collection MUST refer to the current page URL using its `tree:view` property
3. In a subsequent page response, a collection SHOULD refer to the current page URL using its `tree:view` property

## 4. The member extraction algorithm
1. A collection SHOULD contain one or more members
2. A collection MUST refer to each member's root focus node using a `tree:member` property[^2]

## 5. Traversing the search tree
1. A node MAY link using different relations to the same (subsequent) node
2. A node MUST NOT link to a root node
3. A node MUST NOT link to itself
4. Exactly one node MUST link to a subsequent node
5. A node MUST refer to each related page using a `tree:relation` property, which is a relation entity (`tree:Relation` or one of its subclasses)
6. A relation MUST refer to the related page using its `tree:node` property
7. A relation MAY indicate the total number of members that can be found by following its page link (and all the page relations recursively) using its `tree:remainingItems` property

## 6. Pruning branches
1. A constrained relation MUST be a subclass of the generic relation (tree:Relation) and implicitly defines the comparison operator of the constraint[^3]
2. A constrained relation MUST refer to a property path using its `tree:path` property, which indicates to what member property the constraint applies and gives the LHS (left hand side) of the constraint
3. A constrained relation MUST refer to a literal value using its `tree:value` property, which gives the RHS (right hand side) value of the constraint
4. Multiple constrained relations to the same node MUST only link to members for which all these constraints apply (i.e. logical AND)[^4]
5. A constrained relation whose `tree:path` results in multiple values MUST link to members for which at least one of these values match the constraint (i.e. logical OR)[^5]

### 6.1 Comparing strings, IRIs and time literals
1. A non-geospatial constrained relation MUST only link to members for which the constraint matches as defined in the [SPARQL algebra functions](https://www.w3.org/TR/sparql11-query/#expressions)
2. A (non-geospatial) constrained relation whose constraint compares strings MUST only link to members for which the constraint matches equivalence as defined by the [Unicode canonical equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence) and ordering using case-sensitive Unicode code point order
3. A (non-geospatial) constrained relation whose constraint compares IRIs MUST only link to members for which the constraint matches equivalence as simple literals and ordering is defined by the [SPARQL operation ORDER BY](https://www.w3.org/TR/sparql11-query/#modOrderBy)
4. A (non-geospatial) constrained relation whose constraint compares timestamps (`xsd:dateTime`) without timezone indication MUST only link to members for which the constraint matches a time period of 14 hours before (inclusive) and 14 hours after (exclusive) that timestamp[^6]

### 6.2. Comparing geospatial features
1. A geospatial constrained relation MUST only link to members for which the constraint matches as defined by the the operator [geof:sfContains]([geof:sfContains](https://docs.ogc.org/is/22-047r1/22-047r1.html#_simple_features_relation_family))
2. A geospatial constrained relation MUST refer to a WKT literal value using its `tree:value` property
3. A geospatial constrained relation MUST refer to a property path resulting in one or more WKT literals using its `tree:path` property

## 7. Search forms
1. A node MAY refer to one or more search forms using a `tree:search` property

### 7.1. Geospatial XYZ tiles search form
1. A search form for creating a geospatial page link MUST specify a `tree:longitudeTile` (X tile), a `tree:latitudeTile` (Y tile) and a `tree:zoom` (zoom level), which all expect positive integers (`xsd:integer`) when filled in

### 7.2. Searching through a list of objects ordered by time
1. A search form for creating a time-based page link MUST specify a `tree:timeQuery`, which expects a timestamp (`xsd:dateTime`) when filled in
2. A search form for creating a time-based page link MUST specify a `tree:path`, which specifies the predicate path that is used to find an alternative page (if the requested page link does not exist) that contains one or more members with their predicate path value matching the given timestamp

## 8. Vocabulary

## 8.1 Classes

### 8.1.1 tree:Collection
1. A collection MUST refer to one SHACL shape[^7] using its `tree:shape` property

### 8.1.2 tree:Node
1. A node MAY contain one or more relations

### 8.1.3 tree:Relation
1. A prefix relation (`tree:PrefixRelation`) MUST only link to members for which the constraint matches as defined by the [STRSTARTS](https://www.w3.org/TR/sparql11-query/#func-strstarts) SPARQL function[^8]
2. A substring relation (`tree:SubstringRelation`) MUST only link to members for which the constraint matches as defined by the [SUBSTR](https://www.w3.org/TR/sparql11-query/#func-substr) SPARQL function[^9]
3. A suffix relation (`tree:SuffixRelation`) MUST only link to members for which the constraint matches as defined by the [STRENDS](https://www.w3.org/TR/sparql11-query/#func-strends) SPARQL function[^10]
4. A greater-than (`tree:GreaterThanRelation`), greater-than-or-equal-to (`tree:GreaterThanOrEqualToRelation`), less-than (`tree:LessThanRelation`), less-than-or-equal-to (`tree:LessThanOrEqualToRelation`), equal-to (`tree:EqualToRelation`) or not-equal-to (`tree:NotEqualToRelation`) relation MUST only link to members for which the constraint matches as defined by the [SPARQL Operator Mapping](https://www.w3.org/TR/sparql11-query/#OperatorMapping)

## 8.2 Properties

### 8.2.16
1. A node MAY refer to one or more view descriptions using a `tree:viewDescription` property, which all MUST be interpreted together (combined)



[^1]: I.e. this allows to determine the root page of each search tree.

[^2]: I.e. this allows to retrieve all the quads of that member.

[^3]: E.g. `tree:GreaterThanOrEqualToRelation` equals to `>=`, `tree:PrefixRelation` uses `StartsWith(string)`, etc.

[^4]: I.e. all the members in the recursively related nodes will match all the given constraints.

[^5]: I.e. all the members in the recursively related nodes will match the given constraint for at least one of their values which result from applying the constraint's `tree:path` property path.

[^6]: I.e. the half open time interval `[ timestamp - 14:00, timestamp + 14:00 [`

[^7]: The SHACL shape applies to each member without the need to specify a target declaration for the data items.

[^8]: I.e. at least one value resulting from applying the property path on a member starts with the given value.

[^9]: I.e. at least one value resulting from applying the property path on a member contains the given value.

[^10]: I.e. at least one value resulting from applying the property path on a member ends with the given value.
