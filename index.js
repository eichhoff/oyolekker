/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

//import * as tf from '@tensorflow/tfjs';

//import {ControllerDataset} from './controller_dataset';
//import * as ui from './ui';
//import {Webcam} from './webcam';

//init();


//import sigma from './sigma.js-1.2.1/src/sigma.core.js';






//import GPU, { input } from 'gpu.js';

//import sigma from 'sigma';


/**/
//import './node_modules/sigma/build/plugins/sigma.plugins.animate.min.js';
/*
console.log(window);
window.sigma = sigma;
window.document.sigma = sigma;


//import './node_modules/sigma/build/plugins/sigma.plugins.animate.min.js';




/*
abs
acos
asin
atan
atan2
ceil
cos
exp
floor
log
log2
max
min
round
sign 
sin
sqrt
tan
*/
import {LabelCharacter, LabelAlphabet, Label, Node, Edge, Graph} from './graph';

import {Rewriter, Rule, GetNodeOperation, GetEdgeOperation} from './rewriting';

/*
const gpu = new GPU();
 
// Create the GPU accelerated function from a kernel
// function that computes a single element in the
// 512 x 512 matrix (2D array). The kernel function
// is run in a parallel manner in the GPU resulting
// in very fast computations! (...sometimes)
const matMult = gpu.createKernel(function(a, b) {
    var sum = 0;
    for (var i = 0; i < 512; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
}).setOutput([512, 512]);
 
// Perform matrix multiplication on 2 matrices of size 512 x 512
const c = matMult(a, b);
*/


/*
const gpu = new GPU();

const equal = gpu.createKernel(function(a, b) {
  return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
}).setOutput([9]);

*/

/* funktioniert
var kernel1 = gpu.createKernel(function(a, b) {
  return a[this.thread.x] + b[this.thread.x];
}, { output: [5] });

var kernel2 = gpu.createKernel(function(c, d) {
  return c[this.thread.x] * d[this.thread.x];
}, { output: [5] });

const superKernel = gpu.combineKernels(kernel1, kernel2, function(array1, array2, array3) {
  return kernel2(kernel1(array1, array2), array3);
});

const k = superKernel([1,2,3,4,5], [1,2,3,4,5], [1,2,3,4,5]);
*

const kernel1 = gpu.createKernel(function(a, b) {
  return a[this.thread.x] - b[this.thread.x];
}, { output: [5] });

const kernel2 = gpu.createKernel(function(c) {
  let sum = 0;
  for (let i = 0; i < 5; i++) {
      sum += c[i];
  }
  return sum;
}, { output: [1] });

const superKernel = gpu.combineKernels(kernel1, kernel2, function(array1, array2) {
  return kernel2(kernel1(array1, array2));
});

const k = superKernel([1,2,3,4,5], [1,2,3,4,5]);


/*
const add = gpu.createKernel(function(a, b) {
  return a + b;
}).setOutput([9]);

const multiply = gpu.createKernel(function(a, b) {
  return a * b;
}).setOutput([9]);

const superKernel = gpu.combineKernels(add, multiply, function(a, b, c) {
  return multiply(add(a[this.thread.x], b[this.thread.x]), c[this.thread.x]);
});

const k = superKernel(input(new Float32Array([1,2,3,4,5,6,7,8,9]), [3, 3]), 
  input(new Float32Array([1,2,3,4,5,6,7,8,9]), [3, 3]), 
  input(new Float32Array([1,2,3,4,5,6,7,8,9]), [3, 3]));
*/
//console.log(k);


const main = function(){
	console.log('main');

	const nodeAlphabet = new LabelAlphabet();
	const a = new LabelCharacter(nodeAlphabet, "A");
	const b = new LabelCharacter(nodeAlphabet, "B");
	const c = new LabelCharacter(nodeAlphabet, "C");

	const edgeAlphabet = new LabelAlphabet();
	const x = new LabelCharacter(edgeAlphabet, "X");
	const y = new LabelCharacter(edgeAlphabet, "Y");
	const z = new LabelCharacter(edgeAlphabet, "Z");

	const graph1 = new Graph(nodeAlphabet, edgeAlphabet);

	const l1 = graph1.getNodeLabel([b, a, c]);
	const l2 = graph1.getNodeLabel([a, b]);
	const l3 = graph1.getNodeLabel([a, b]);

	const l4 = graph1.getEdgeLabel([x]);
	const l5 = graph1.getEdgeLabel([x]);
	const l6 = graph1.getEdgeLabel([x, y, z]);

	const n1 = new Node(graph1, l1);
	const n2 = new Node(graph1, l2);
	const n3 = new Node(graph1, l3);
	const n4 = new Node(graph1, l3);


	const e1 = new Edge(graph1, n1, n2, l4);
	const e2 = new Edge(graph1, n2, n3, l5);
	const e3 = new Edge(graph1, n3, n1, l6);

	console.log(graph1);


	const graph2 = new Graph(nodeAlphabet, edgeAlphabet);
	graph2.nextNodeID = 10;

	const l1_ = graph2.getNodeLabel([a, b]);
	const l2_ = graph2.getNodeLabel([a, b]);
	const l3_ = graph2.getNodeLabel([a, b]);

	const l4_ = graph2.getEdgeLabel([x]);
	const l5_ = graph2.getEdgeLabel([x]);
	const l6_ = graph2.getEdgeLabel([x, y, z]);

	const n1_ = new Node(graph2, l3_);
	const n2_ = new Node(graph2, l2_);
	const n3_ = new Node(graph2, l1_);
	const n4_ = new Node(graph2, l1_);

	const e2_ = new Edge(graph2, n2_, n1_, l5_);
	const e1_ = new Edge(graph2, n3_, n2_, l4_);
	const e3_ = new Edge(graph2, n1_, n3_, l6_);

	console.log(graph2);


	graph1.isIsomorphism(graph2).then((resolvedValue) => {
	    console.log('resolved', resolvedValue);
	}, (error) => {
	    console.log('rejected', error);
	});


	graph1.draw(document.getElementById('graph-container'));


	let alphabetLength = 3 + 1; 
	// 10     => 999
	// 100    => 999999
	// 1000   => 999999999
	// 10000  => 999999999999
	// 100000 => 999999999999999
	let maxAlphabetID = alphabetLength -1;
	let p = 3;
	let maxLabelID = 0;
	while (p--) {
	  maxLabelID += maxAlphabetID * Math.pow(alphabetLength, p);
	}
	console.log('maxLabelID', maxLabelID);


  let rewriter = new Rewriter(nodeAlphabet, edgeAlphabet);
  
  let op1 = new GetNodeOperation(rewriter, 1, [2, a, 3]);
  let op2 = new GetEdgeOperation(rewriter, 4, 5, 1, [x, y, z]);
  let rule1 = new Rule(rewriter, [op1, op2]);

  let op3 = new GetNodeOperation(rewriter, 14, [a, 15]);
  let rule2 = new Rule(rewriter, [op3]);


  rewriter.apply(graph1, [rule1, rule2]);

}


/*
let draw = function(){

  let sigma = window.sigma;

  console.log(sigma.canvas.edges.def);
  console.log(sigma.canvas.edges.curve);

  console.log(sigma);

  var i,
      s,
      o,
      L = 3,
      N = 10,
      E = 10,
      g = {
        nodes: [],
        edges: []
      },
      step = 0;

  // Generate a random graph:
  for (i = 0; i < N; i++) {
    o = {
      id: 'n' + i,
      label: 'Node ' + i,
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

    ['x', 'y', 'size', 'color'].forEach(function(val) {
      o[val] = o['grid_' + val];
    });

    g.nodes.push(o);
  }

  for (i = 0; i < E; i++)
    g.edges.push({
      id: 'e' + i,
      label: 'Edge ' + i,
      size: 1, //Math.random(),
      source: 'n' + (Math.random() * N | 0),
      target: 'n' + (Math.random() * N | 0),
      type: 'curvedArrow'
    });

/*
  s = new sigma({
    graph: g,
    renderer: {
      container: document.getElementById('graph-container'),
      type: 'canvas'
    },
    settings: {
      animationsTime: 1000,
      edgeLabelSize: 'proportional'
    }
  });
  *

  s = new sigma({ 
    graph: g,
    container: 'graph-container',
    renderer: {
      container: document.getElementById('graph-container'),
      type: sigma.renderers.canvas
    }
  });

  setInterval(function() {
    var prefix = ['grid_', 'circular_'][step = +!step];
    //console.log(prefix);
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
*/

import('sigma').then((module) => {
  window.sigma = module;
  import('./node_modules/sigma/build/plugins/sigma.plugins.animate.min.js').then((module) => {
    import('./node_modules/sigma/build/plugins/sigma.renderers.edgeLabels.min.js').then((module) => {
      import('./node_modules/sigma/build/plugins/sigma.renderers.parallelEdges.min.js').then((module) => {
        main();
      });
    });
  });
});




/*
  <script src="sigma.js-1.2.1/plugins/sigma.plugins.animate/sigma.plugins.animate.js"></script>
  <script src="sigma.js-1.2.1/plugins/sigma.renderers.edgeLabels/settings.js"></script>
  <script src="sigma.js-1.2.1/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def.js"></script>
  <script src="sigma.js-1.2.1/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.curve.js"></script>
  <script src="sigma.js-1.2.1/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.curvedArrow.js"></script>
*/


/*----*/


