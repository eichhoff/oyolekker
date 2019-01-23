import {TreeMap} from './treemap'; // TODO: check if this implementation is actually O(log n) 
import SortedSet from 'js-sorted-set';



/*
Operation Array Binary tree Red-black tree
Create  O(1)  O(1)  O(1)
Length  O(1)  O(1)  O(1)
Clear O(1)  O(n) (in garbage collector) O(n) (in garbage collector)
Insert  O(n) (often slow) O(n) (often slow) O(lg n) (fast)
Remove  O(n) (often slow) O(n) (often slow) O(lg n) (fast)
Iterate O(n) (fast) O(n) (slowest)  O(n) (slower than Array)
Find, Test  O(lg n) (fastest) O(n) (slowest)  O(lg n) (slower than Array)
*/

export class LabelCharacter {
  constructor(alphabet, object) {
    this.alphabet = alphabet;
    this.object = object;
    this.id = alphabet.nextCharacterID++;
    this.alphabet.characters[this.id] = this;
  }
}

export class LabelAlphabet {
  constructor() {
    this.nextCharacterID = 0;
    this.characters = [];
  }
}

export class NodeLabel {
  constructor(graph, id) {
    this.graph = graph;
    this.id = id;
    this.inUse = 0;
    this.graph.nodeLabels.put(this.id, this);
  }
}

export class EdgeLabel {
  constructor(graph, id) {
    this.graph = graph;
    this.id = id;
    this.inUse = 0;
    this.graph.edgeLabels.put(this.id, this);
  }
}

export class LabelFrequency {
  constructor(labels) {
    /*let i = labels.length -1;
    while(i--){

    }*/

    //new Float32Array([1,2,3,4,5,6,7,8,9])
  }
}

const compareNodes = function(node1, node2) { 
  return node1.id - node2.id; 
};
export class Node {
  constructor(graph, label) {
    this.graph = graph;
    this.id = graph.nextNodeID++;
    this.label = label;
    this.label.inUse++;
    this.graph.nodes.put(this.id, this);
  }
}

const compareEdges = function(edge1, edge2) { 
  let diff = edge1.label.id - edge2.label.id;
  if(diff !== 0) return diff;

  diff = edge1.sourceNode.id - edge2.sourceNode.id;
  if(diff !== 0) return diff;
  
  diff = edge1.targetNode.id - edge2.targetNode.id;
  if(diff !== 0) return diff;

  

  /*
  diff = edge1.labels.length - edge2.labels.length;
  if(diff !== 0) return diff;

  var i = edge1.labels.length;
  while (i--) {
    diff = edge1.labels[i].id - edge2.labels[i].id;
    if(diff !== 0) return diff;
  }
  */

  return 0;
};
/*const compareEdges2 = function(edge1, edge2) { 
  
  let diff = edge1.labels.length - edge2.labels.length;
  if(diff !== 0) return diff;

  var i = edge1.labels.length;
  while (i--) {
    diff = edge1.labels[i].id - edge2.labels[i].id;
    if(diff !== 0) return diff;
  }

  diff = edge1.sourceNode.labels.length - edge2.sourceNode.labels.length;
  if(diff !== 0) return diff;

  var i = edge1.sourceNode.labels.length;
  while (i--) {
    diff = edge1.sourceNode.labels[i].id - edge2.sourceNode.labels[i].id;
    if(diff !== 0) return diff;
  }

  diff = edge1.targetNode.labels.length - edge2.targetNode.labels.length;
  if(diff !== 0) return diff;

  var i = edge1.targetNode.labels.length;
  while (i--) {
    diff = edge1.targetNode.labels[i].id - edge2.targetNode.labels[i].id;
    if(diff !== 0) return diff;
  }

  diff = edge1.sourceNode.id - edge2.sourceNode.id;
  if(diff !== 0) return diff;
  
  diff = edge1.targetNode.id - edge2.targetNode.id;
  if(diff !== 0) return diff;

  return 0;
};*/
export class Edge {
  constructor(graph, sourceNode, targetNode, label) {
    this.graph = graph;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.label = label;
    this.label.inUse++;
    this.graph.edges.insert(this);
  }
}

export class Graph {
  constructor(nodeAlphabet, edgeAlphabet) {
    this.nodeAlphabet = nodeAlphabet;
    this.edgeAlphabet = edgeAlphabet;
    this.nodeLabels = new TreeMap();
    this.edgeLabels = new TreeMap();
    this.nextNodeID = 0; // no negative IDs allowed
    this.nodes = new TreeMap();
    this.edges = new SortedSet({ comparator: compareEdges });

    this.getNodeLabel = function(characters){
      let id = 0;
      var i = characters.length;
      while (i--) {
        id += characters[i].id * Math.pow(this.nodeAlphabet.characters.length, i);
      }
      let label = this.nodeLabels.get(id);
      if(!label) label = new NodeLabel(this, id);
      return label;
    }

    this.getEdgeLabel = function(characters){
      let id = 0;
      var i = characters.length;
      while (i--) {
        id += characters[i].id * Math.pow(this.edgeAlphabet.characters.length, i);
      }
      let label = this.edgeLabels.get(id);
      if(!label) label = new EdgeLabel(this, id);
      return label;
    }

    this.shallowCompare = function(graph){
      if (this.nodeAlphabet === graph.nodeAlphabet &&
        this.edgeAlphabet === graph.edgeAlphabet &&
        this.edgeLabels.size() === graph.edgeLabels.size() &&
        this.nodeLabels.size() === graph.nodeLabels.size() &&
        this.edges.length === graph.edges.length &&
        this.nodes.size() === graph.nodes.size()
        ) {
          return true;
      }
      return false;
    }

    const compareNumbers = function(a, b) { 
      let diff = a - b;
      return diff;
    };


    const compareEdgeMappingsByFrequency = function(mapping1, mapping2) { // nodes/edges with more frequent labels will be matched later
      let diff = mapping1.thisEdges.length - mapping2.thisEdges.length;
      return diff;
    };

    const checkLabelFrequenciesForEquality = function(node1, node2) { // maintain blacklist
      // node2's frequency tables must not contain any additional labelIDCombinations
      for (let labelIDCombination in node2.outLabelFrequency)
        if(node1.outLabelFrequency[labelIDCombination] === undefined) return false;
      for (let labelIDCombination in node2.inLabelFrequency)
        if(node1.inLabelFrequency[labelIDCombination] === undefined) return false;
      // node1's frequency tables are are identicial to those of node2
      for (let labelIDCombination in node1.outLabelFrequency)
        if(node1.outLabelFrequency[labelIDCombination] !== node2.outLabelFrequency[labelIDCombination]) return false;
      for (let labelIDCombination in node1.inLabelFrequency)
        if(node1.inLabelFrequency[labelIDCombination] !== node2.inLabelFrequency[labelIDCombination]) return false;
      return true;
    }

    const resolveVariableMappings = function(sortedVariableMappingsIterator, fixedMapping, success, i = 0) {
      const mappingGroup = sortedVariableMappingsIterator.value();

      let j = mappingGroup.thatEdges.length;
      const k = i + 1;
      while (j--) {
        console.log(i, j);

        const sourceNodeMap = fixedMapping.get(mappingGroup.thisEdges[i].sourceNode.id);
        if(sourceNodeMap !== undefined) {
          if(sourceNodeMap !== mappingGroup.thatEdges[j].sourceNode.id) continue;
        }

        const targetNodeMap = fixedMapping.get(mappingGroup.thisEdges[i].targetNode.id);
        if(targetNodeMap !== undefined) {
          if(targetNodeMap !== mappingGroup.thatEdges[j].targetNode.id) continue;
        }

        if(checkLabelFrequenciesForEquality(mappingGroup.thisEdges[i].sourceNode, mappingGroup.thatEdges[j].sourceNode) && 
          checkLabelFrequenciesForEquality(mappingGroup.thisEdges[i].targetNode, mappingGroup.thatEdges[j].targetNode)) {
          
          fixedMapping.put(mappingGroup.thisEdges[i].sourceNode.id, mappingGroup.thatEdges[j].sourceNode.id);
          fixedMapping.put(mappingGroup.thisEdges[i].targetNode.id, mappingGroup.thatEdges[j].targetNode.id);
          
          console.log('matched', i);
          let stopSearch;
          if(k < mappingGroup.thisEdges.length) { // not all edges of this group have been mapped yet
            stopSearch = resolveVariableMappings(sortedVariableMappingsIterator, fixedMapping, success, k);
          } else if (sortedVariableMappingsIterator.hasNext()) { // all edges of this group have been mapped
            const nextSortedVariableMappingsIterator = sortedVariableMappingsIterator.next();
            if(nextSortedVariableMappingsIterator.value() !== null) { // this was the last group to be mapped
              stopSearch = resolveVariableMappings(nextSortedVariableMappingsIterator, fixedMapping, success, 0);
            } else {
              stopSearch = success(fixedMapping);
            } 
          }
          if(stopSearch) return true;

          fixedMapping.remove(mappingGroup.thisEdges[i].sourceNode.id);
          fixedMapping.remove(mappingGroup.thisEdges[i].targetNode.id);
        }
      }
    }

    this.isIsomorphism = function(thatGraph, findAllMappings){
      const thisGraph = this;

      return new Promise(function(resolve, reject) {

        if (!thisGraph.shallowCompare(thatGraph)) 
          return reject('shallow compare of graphs failed');

        var mappings = {};

        thisGraph.nodes.forEach(function(node) { 
          node.outLabelFrequency = {};
          node.inLabelFrequency = {};
        });
        thatGraph.nodes.forEach(function(node) { 
          node.outLabelFrequency = {};
          node.inLabelFrequency = {};
        });

        thisGraph.edges.forEach(function(edge) { 
          const labelIDCombination = edge.sourceNode.label.id + '>' + edge.label.id + '>' + edge.targetNode.label.id;
          let mapping = mappings[labelIDCombination];
          if (!mapping) {
            mappings[labelIDCombination] = {thisEdges: [edge], thatEdges: []};
          } else {
            mapping.thisEdges.push(edge);
          }

          if(edge.sourceNode.outLabelFrequency[labelIDCombination] === undefined)
            edge.sourceNode.outLabelFrequency[labelIDCombination] = 1;
          else edge.sourceNode.outLabelFrequency[labelIDCombination]++;
          if(edge.targetNode.inLabelFrequency[labelIDCombination] === undefined)
            edge.targetNode.inLabelFrequency[labelIDCombination] = 1;
          else edge.targetNode.inLabelFrequency[labelIDCombination]++;
        });

        thatGraph.edges.forEach(function(edge) { 
          const labelIDCombination = edge.sourceNode.label.id + '>' + edge.label.id + '>' + edge.targetNode.label.id;
          let mapping = mappings[labelIDCombination];
          if (!mapping) {
            return reject('a source-node => edge => target-node label-combination is missing');
          } else {
            mapping.thatEdges.push(edge);
          }
          if(edge.sourceNode.outLabelFrequency[labelIDCombination] === undefined)
            edge.sourceNode.outLabelFrequency[labelIDCombination] = 1;
          else edge.sourceNode.outLabelFrequency[labelIDCombination]++;
          if(edge.targetNode.inLabelFrequency[labelIDCombination] === undefined)
            edge.targetNode.inLabelFrequency[labelIDCombination] = 1;
          else edge.targetNode.inLabelFrequency[labelIDCombination]++;
        });

        console.log(mappings);

        for (let labelIDCombination in mappings) {
          const mapping = mappings[labelIDCombination];
          if(mapping.thisEdges.length !== mapping.thatEdges.length) 
            return reject('there is a different number of edges for a source-node => edge => target-node label-combination');
        }

        const fixedMapping = new TreeMap();

        const sortedVariableMappings = new SortedSet({ comparator: compareEdgeMappingsByFrequency });
        for (let labelIDCombination in mappings) {
          const mapping = mappings[labelIDCombination];
          if(mapping.thisEdges.length > 1) {
            sortedVariableMappings.insert(mapping);
          } else { // there is only one possiblity to map these edges
            if(checkLabelFrequenciesForEquality(mapping.thisEdges[0].sourceNode, mapping.thatEdges[0].sourceNode) && 
              checkLabelFrequenciesForEquality(mapping.thisEdges[0].targetNode, mapping.thatEdges[0].targetNode)) {
              fixedMapping.put(mapping.thisEdges[0].sourceNode.id, mapping.thatEdges[0].sourceNode.id);
              fixedMapping.put(mapping.thisEdges[0].targetNode.id, mapping.thatEdges[0].targetNode.id);
            } else {
              return reject('there is only one possiblity to map two edges, but there are differences in the neighbourhood of the incident nodes in terms of labels'); 
            }          
          }
        }

        thisGraph.nodes.forEach(function(node){
          if(Object.keys(node.outLabelFrequency).length === 0 && Object.keys(node.inLabelFrequency).length === 0) {
            fixedMapping.put(node.id, -node.label.id);
          }
        });

        thatGraph.nodes.forEach(function(node){
          if(Object.keys(node.outLabelFrequency).length === 0 && Object.keys(node.inLabelFrequency).length === 0) {
            let matchFound = false;
            for (let nodeID in fixedMapping.dict){
              if(fixedMapping.dict[nodeID] === -node.label.id) {
                fixedMapping.dict[nodeID] = node.id;
                matchFound = true;
                break;
              }
            }
            if(!matchFound) return reject('there is a node with no edges which could not be mapped');
          }
        });

        const success = function(resultingMapping){
          resolve(resultingMapping);
          if(!findAllMappings) return true; // stop search within resolveVariableMappings
        }

        resolveVariableMappings(sortedVariableMappings.beginIterator(), fixedMapping, success);

      });
    }


    this.draw = function(targetContainer){
		let sigma = window.sigma;

		console.log(this.edges);

		var i,
			s,
			o,
			L = 3,
			N = this.nodes.size(),
			E = this.edges.length,
			g = {nodes: [], edges: []},
			step = 0;

	 	i = 0;
		this.nodes.forEach(function(node){
			o = {
			  id: 'n' + node.id,
			  label: 'Node ' + node.label.id,
			  circular_x: L * Math.cos(Math.PI * 2 * i / N - Math.PI / 2),
			  circular_y: L * Math.sin(Math.PI * 2 * i / N - Math.PI / 2),
			  circular_size: 1,//Math.random(),
			  circular_color: '#' + (
			    Math.floor(Math.random() * 16777215).toString(16) + '000000'
			  ).substr(0, 6),
			  grid_x: i % L,
			  grid_y: Math.floor(i / L),
			  grid_size: 1,
			  grid_color: '#ccc'
			};
			i++;

			['x', 'y', 'size', 'color'].forEach(function(val) {
			  o[val] = o['grid_' + val];
			});

			g.nodes.push(o);
		});

		i = 0;
		this.edges.forEach(function(edge) { 
			g.edges.push({
			  id: 'e' + i++,
			  label: 'Edge ' + edge.label.id,
			  size: 1,
			  source: 'n' + edge.sourceNode.id,
			  target: 'n' + edge.targetNode.id,
			  type: 'curvedArrow'
			});
		});

		s = new sigma({graph: g, container: 'graph-container',
			renderer: {
				container: targetContainer,
				type: sigma.renderers.canvas
			}
		});

		setInterval(function() {
			var prefix = ['grid_', 'circular_'][step = +!step];
			sigma.plugins.animate(
			  s,
			  {
			    x: prefix + 'x',
			    y: prefix + 'y',
			    size: prefix + 'size',
			    color: prefix + 'color'
			  }
			);
		}, 4000);
	}



  }

  
     //contains

      /*
      var resortedEdges = new SortedSet({ comparator: compareByLabel });
      this.edges.forEach(function(edge) { resortedEdges.insert(edge) });

      var labelProfile = new Array();
      resortedEdges.forEach(function(edge) { 
        if (edge.inUse > 1) {
          labelProfile.push(edge.sourceNode.label.id);
          labelProfile.push(edge.label.id);
          labelProfile.push(edge.targetNode.label.id);
        } 
      });

      console.log(resortedEdges.map(function(edge) { return edge.label.inUse; })); // returns [ 20, 4 ]
      */

      /*
    
    var set = new SortedSet({ comparator: compareNumbers });
    set.insert(5);
    set.insert(3);
    set.insert(2);
    set.remove(3);
    var yes = set.contains(2);
    console.log(set.map(function(x) { return x * 2; })); // returns [ 20, 4 ]

    */


  // durch kanten durchgehen mit backtracking
  // 1 kante übereinstimmung + knoten übereinstimmung
  // knoten nach entropie sortieren?
  // einzelne knoten können wahrscheinlich austauschbar sein -> später im baum -> sonst muss zu viel gebacktracked werden und so etwas wie ein rete algorithmus implementiert werden
  // also einzelne knoten zuleztt
  // möglichst eindeutige knoten zuerst
  // eindeutige knoten sind jene die eine hohe entropie haben (ja?)
  // knoten labels plus adjazente und inzidente labels
  // 
  // ID zuletzt


}

/*

var i = array.length;

while (i--) {
  //do something
}
*/