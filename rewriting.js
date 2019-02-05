import {TreeMap} from './treemap'; // TODO: check if this implementation is actually O(log n) 
import SortedSet from 'js-sorted-set';

import {LabelCharacter, LabelAlphabet, Label, Node, Edge, Graph} from './graph';



const compareVariables = function(var1, var2) { 
  return var1 - var2;;
};

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
      
      // construct rete if necessary;
      this.constructRete();

      if (Array.isArray(derivationProgram)) {
        for (let i in derivationProgram) {
          let rule = derivationProgram[i];
          rule.apply(graph);
        }
      } else {
        // TODO
      }
    }

    // LHS
    this.reteLayer1 = [];
    this.reteLayer2 = [];
    // RHS
    this.reteLayer3 = [];


    this.reteLayer1To2 = [];
    this.reteLayer2To3 = [];

    this.addToRete = function(layer, operation){
      switch(layer) {
        case 1: 
          this.reteLayer1.push(operation);
          break;
        case 2:
          this.reteLayer2.push(operation);
          break;
        case 3:
          this.reteLayer3.push(operation);
          break;
      }
    }

    this.constructRete = function(){
    
      /*
      let i = 4;
      while (i--) {
        let j = 4;
        while (--j > i) {
          console.log(i, j);
        }
      }
      */
      
      const length = this.reteLayer1.length;
      let i = length - 1;
      let join = this.reteLayer1[i];
      while (i--) {
        console.log(join);
        const op = this.reteLayer1[i];
        const newJoin = new ReteNode(join, op);
        op.variables.forEach((variable) => {
          if (join.variables.contains(variable)) {
            newJoin.commonVariables.insert(variable);
          } else {
            newJoin.variables.insert(variable);
          }
        });
        join.variables.forEach((variable) => {
          newJoin.variables.insert(variable);
        });
        join = newJoin;
      }

      /*thisGraph.edges.forEach(function(edge) { 

      }*/
     
    }
  }
}

export class ReteNode {
  constructor(parent1, parent2){
    this.parent1 = parent1;
    this.parent2 = parent2;
    this.variables = new SortedSet({ comparator: compareVariables });
    this.commonVariables = new SortedSet({ comparator: compareVariables });

    this.apply = function(){
      // if two nodes of same layer share variables, add a method for splitting into sets
      if(commonVariables.length > 0) {

      } else { // else just add each set as is

      }
    }
  }
}

export class Rule {
  constructor(rewriter, directDerivationProgram) {
    this.rewriter = rewriter;
    this.directDerivationProgram = directDerivationProgram;
  
    if (Array.isArray(directDerivationProgram)) {
      this.apply = function(graph){
        let workingMemory = new TreeMap();
        for (let i in directDerivationProgram) {
          let operation = directDerivationProgram[i];
          operation.apply(graph, workingMemory);
        }
      }
    } else {
      // TODO
    }
  }

}

export class GetNodeOperation {
  constructor(rewriter, nodeVariableID, characters) {
    
    this.variables = new SortedSet({ comparator: compareVariables });
    this.variables.insert(nodeVariableID);

    let targetPatternID = 0;
    let targetPatternBitmask = 0;
    let i = characters.length;
    let maxCharacterID = rewriter.nodeAlphabet.size() - 1;
    let labelVarIDs = [];
    let labelVarBitmasks = [];
    let labelVarOffsets = [];

    while (i--) {
      const baseFactor = Math.pow(rewriter.nodeAlphabet.size(), i);
      console.log('baseFactor', baseFactor, Math.sqrt(baseFactor));
      if(characters[i].id) {
        targetPatternID += characters[i].id * baseFactor;
        targetPatternBitmask += maxCharacterID * baseFactor;
      } else {
        this.variables.insert(characters[i]);
        labelVarIDs.push(characters[i]);
        labelVarBitmasks.push(maxCharacterID * baseFactor);
        if(baseFactor === 1) labelVarOffsets.push(0);
        else labelVarOffsets.push(Math.sqrt(baseFactor));
      }
    }

    rewriter.addToRete(1, this);

    this.apply = function(graph, workingMemory){
      graph.nodes.forEach(function(node) { 
        let bitmaskedID = node.label.id & targetPatternBitmask;
        if(bitmaskedID === targetPatternID) {
          console.log('match', node);
          let i = labelVarIDs.length;
          while (i--) {
            let labelID = (node.label.id & labelVarBitmasks[i]) >> labelVarOffsets[i];
            console.log('label var', labelVarIDs[i], labelID, labelVarBitmasks[i], labelVarOffsets[i]);
          }
          // TODO: add elements to working memory
        }
      });
    }
  }
}

export class GetEdgeOperation {
  constructor(rewriter, edgeVariableID, sourceNodeVariableID, targetNodeVariableID, characters) {
    
    this.variables = new SortedSet({ comparator: compareVariables });
    this.variables.insert(edgeVariableID, sourceNodeVariableID, targetNodeVariableID);

    let targetPatternID = 0;
    let targetPatternBitmask = 0;
    let i = characters.length;
    let maxCharacterID = rewriter.edgeAlphabet.size() - 1;
    let labelVarIDs = [];
    let labelVarBitmasks = [];
    let labelVarOffsets = [];

    while (i--) {
      const baseFactor = Math.pow(rewriter.edgeAlphabet.size(), i);
      console.log('baseFactor', baseFactor, Math.sqrt(baseFactor));
      if(characters[i].id) {
        targetPatternID += characters[i].id * baseFactor;
        targetPatternBitmask += maxCharacterID * baseFactor;
      } else {
        this.variables.insert(characters[i]);
        labelVarIDs.push(characters[i]);
        labelVarBitmasks.push(maxCharacterID * baseFactor);
        if(baseFactor === 1) labelVarOffsets.push(0);
        else labelVarOffsets.push(Math.sqrt(baseFactor));
      }
    }

    rewriter.addToRete(1, this);

    this.apply = function(graph, workingMemory){
      graph.edges.forEach(function(edge) { 
        let bitmaskedID = edge.label.id & targetPatternBitmask;
        if(bitmaskedID === targetPatternID) {
          console.log('match', edge);
          let i = labelVarIDs.length;
          while (i--) {
            let labelID = (edge.label.id & labelVarBitmasks[i]) >> labelVarOffsets[i];
            console.log('label var', labelVarIDs[i], labelID, labelVarBitmasks[i], labelVarOffsets[i]);
          }
          // TODO: add elements to working memory
        }
      });
    }
  }
}

