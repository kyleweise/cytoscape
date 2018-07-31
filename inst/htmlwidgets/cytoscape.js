HTMLWidgets.widget({

  name: 'cytoscape',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    var elementId = el.id;
    var container = document.getElementById(elementId);
    var cy = cytoscape({
      container: container
    });

    return {

      renderValue: function(opts) {


        //alias this
        var that = this;

        container.widget = that;

        console.log("testingtestingtesting");
        console.log(opts);
        //console.log(container);
        //console.log(document);
        //var mutation_btn = document.getElementsByClassName("btn btn-default action-button shiny-bound-input")[0]
        //.onclick = function(ev) { that.toggle_mutation(); };


        // TODO: code to render the widget, e.g.

        var nodes = HTMLWidgets.dataframeToD3(opts.nodes);
        var edges = HTMLWidgets.dataframeToD3(opts.edges);

        //console.log(nodes[1]);

        // add data label to each element
        for(var n in nodes) {
          nodes[n] = {data: nodes[n], position: nodes[n]};
        }
        for(var e in edges) {
          edges[e] = {data: edges[e]};
        }

        // create style
        var style = [
              {selector: 'node', style: opts.node_style},
              {selector: 'edge', style: opts.edge_style}
        ];


        // if opts.images exists
        if (opts.hasOwnProperty('images')) {
          var images = HTMLWidgets.dataframeToD3(opts.images);
          for (i = 0; i < images.length; ++i) {
            images[i] = {selector: '#' + images[i].id, style: {'background-image': images[i].images}};
          }
          // add regular style
          Array.prototype.push.apply(style, images);
          console.log(style);
        }

        //initialize with JSON string
        if (opts.json !== null) {

          var json = JSON.parse(opts.json);
          //console.log(json);

          cy = cytoscape({
            container: container, // container to render in
            elements: json.elements,
            style: json.style,
            layout: json.layout
          });

          cy.json(json);

          // add panzoom
          if(opts.hasOwnProperty('panzoom')){
            cy.panzoom(opts.panzoom);
          }

        } else {

          // setup basic plot
          cy = cytoscape({

              container: container, // container to render in

              elements: {
                nodes: nodes,
                edges: edges
              },


              style: style,
              layout: opts.layout

            });
          console.log(opts);
          if(opts.hasOwnProperty('panzoom')){
            cy.panzoom(opts.panzoom);
          }
        }


        //in shiny context
        if(HTMLWidgets.shinyMode){

          cy.on('tap', 'node', function(evt){
            var node = evt.target;
            console.log('tapped node ' + node.id());
            console.log(node);
            //Shiny.onInputChange(elementId + "_selected", node);
          });

          cy.on('tap', 'edge', function(evt){
            var edge = evt.target;
            console.log('tapped edge ' + edge.id());
            Shiny.onInputChange(elementId + "_selected", edge);
          });

          cy.on('tap', 'cy', function(evt){
            var bg = evt.target;
            console.log('tapped on background');

          });

        }
        //console.log(opts);
        var numApiCalls = opts['api'].length;
        for(var i = 0; i < numApiCalls; i++){
          var call = opts['api'][i];
          var method = call.method;
          delete call['method'];
          try {
            that[method](call);
          } catch(err){}
        }
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      },
      toggle_mutation: function(params) {
        var eles = cy.$('node[role = "mutation"]');
        console.log("In toggle_mutation function");
        console.log(params);


        if(params.show){
           eles.style("visibility", "visible");
           params.show = false;

        } else {
          eles.style("visibility", "hidden");
          params.show = true;

        }

      },

      filter: function(params) {
        console.log("In filter..");
        var all_nodes = cy.nodes().length;
        var filtered_nodes = cy.nodes().filter(params.filter).length;
        console.log("Total # of nodes: " + all_nodes);
        console.log("Filtered # of nodes: " + filtered_nodes);
      }

    };
  }
});


//Attach message handlers if in shiny mode (these correspond to API)
if(HTMLWidgets.shinyMode) {
  var fxns = ['toggle_mutation', 'filter'];

  var addShinyHandler = function(fxn) {
    return function() {
      Shiny.addCustomMessageHandler(
        "cytoscape:" + fxn, function(message) {
          var el = document.getElementById(message.id);
          if (el) {
            delete message['id'];
            el.widget[fxn](message);
          }
        }
      );
    };
  };

  for(var i = 0; i < fxns.length; i++){
    addShinyHandler(fxns[i])();
  }
}
