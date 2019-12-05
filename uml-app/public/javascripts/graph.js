var g = new Dracula.Graph();

g.addEdge("strawberry", "cherry");
g.addEdge("strawberry", "apple");
g.addEdge("strawberry", "tomato");

g.addEdge("tomato", "apple");
g.addEdge("tomato", "kiwi");

g.addEdge("cherry", "apple");
g.addEdge("cherry", "kiwi");

var layouter = new Dracula.Layout.Spring(g);
layouter.layout();

var renderer = new Dracula.Renderer.Raphael('canvas', g, 400, 300);
renderer.draw();
