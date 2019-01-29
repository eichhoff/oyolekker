import {TreeMap} from './treemap'; // TODO: check if this implementation is actually O(log n) 
import SortedSet from 'js-sorted-set';

import {LabelCharacter, LabelAlphabet, Label, Node, Edge, Graph} from './graph';

export class Rewriter {

    // TODO: move to rule
    /*
    this.nodeVars = new TreeMap();
    this.nodeLabelVars = new TreeMap();
    this.edgeVars = new TreeMap();
    this.edgeLabelVars = new TreeMap();
    */

  constructor(nodeAlphabet, edgeAlphabet) {
    this.nodeAlphabet = nodeAlphabet;
    this.edgeAlphabet = edgeAlphabet;

    this.apply = function(graph, derivationProgram){
      if (Array.isArray(derivationProgram)) {
        for (let i in derivationProgram) {
          derivationProgram[i].apply(graph);
        }
      } else {
        // TODO
      }
    }
  }
  
}

export class Rule {
  constructor(rewriter, directDerivationProgram) {
    this.rewriter = rewriter;
    this.directDerivationProgram = directDerivationProgram;
  
    if(Array.isArray(directDerivationProgram)) {
      this.apply = function(graph){
        for (let i in directDerivationProgram) {
          directDerivationProgram[i].apply(graph);
        }
      }
    } else {
      // TODO
    }
  }

}

export class GetNodeOperation {
  constructor(rewriter, nodeVarKey, characters) {
    let targetPatternID = 0;
    let targetPatternBitmask = 0;
    let i = characters.length;
    let maxCharacterID = rewriter.nodeAlphabet.size() - 1;
    while (i--) {
      if(characters[i].id) {
        let baseFactor = Math.pow(rewriter.nodeAlphabet.size(), i);
        targetPatternID += characters[i].id * baseFactor;
        targetPatternBitmask += maxCharacterID * baseFactor;
      } else {
        //this.nodeLabelVars.put(characters[i], null);
      }
    }


    this.apply = function(graph){
      

      graph.nodes.forEach(function(node) { 
        let bitmaskedID = node.label.id & targetPatternBitmask;
        if(bitmaskedID === targetPatternID) {
          console.log('match', node)

        }
      });




      /*let label = this.nodeLabels.get(id);
      if(!label) label = new NodeLabel(this, id);
      return label;*/

    }



/*
    this.compileGetEdge = function(edgeVarKey, characters){
      let id = 0;
      var i = characters.length;
      while (i--) {
        id += characters[i].id * Math.pow(this.edgeAlphabet.size(), i);
      }

      let label = this.edgeLabels.get(id);
      if(!label) label = new EdgeLabel(this, id);
      return label;

    }*/
  }
}





/*

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

  return 0;
};

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

}
*/
