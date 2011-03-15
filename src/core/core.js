/**
 * @fileOverview VIE^2
 * @author <a href="mailto:sebastian.germesin@dfki.de">Sebastian Germesin</a>
 */

//VIE^2 is the semantic enrichment layer on top of VIE. 
//Through it you can query and find related content 
//for your editables. VIE^2 can talk to services like 
//Apache Stanbol and OpenCalais to find related 
//information for your content.
(function($, undefined) {

//VIE^2 is implmented as a [jQuery UI widget](http://semantic-interaction.org/blog/2011/03/01/jquery-ui-widget-factory/). 
    $.widget('VIE2.vie2', {
    	
    	// default options
    	options: {
    		//<strong>namespaces</strong>: There are currently some default namespaces given, which
    		//can be overwritten and/or extended using the .vie2('option', ...) method.
    		namespaces: {
				'dbpedia' : 'http://dbpedia.org/resource/',
				'dbprop' : 'http://dbpedia.org/property/',
				'dbonto' : 'http://dbpedia.org/ontology/',
				'rdf' : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
				'rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
				'iks' : 'http://www.iks-project.eu/#',
				'fise' : 'http://fise.iks-project.eu/ontology/',
				'foaf' : 'http://xmlns.com/foaf/0.1/',
				'dc' : 'http://purl.org/dc/terms/',
				'geo' : 'http://www.w3.org/2003/01/geo/wgs84_pos#'
			},
    		//<strong>contextchanged</strong>: the contextchanged event (triggered after analysis)
    		//you can bind to that event like this:
    		//<code><pre>$(...).vie2().bind('vie2contextchanged', function () {});</pre></code>
    		contextchanged: jQuery.noop
    	},
    	
    	//<strong>_context</strong>: The private _context object stores for each connector
    	//the returned result. The values are <pre>rdfQuery objects</pre>.
    	_context: {},
		
		//<strong>_matches</strong>: The private _matches array stores the matches of the last 'filter' call.
		_matches: [],

		//<strong>_oldMatches</strong>: The private _oldMatches array stores the matches of the 'filter' call before
		//the last one.
		_oldMatches: [],
    	
		//<strong>_create</strong>: This initializes the VIE^2 object.
    	_create: function() {
			jQuery.VIE2.log("info", "VIE2.core", "Start " + this.element);
			jQuery.VIE2.log("info", "VIE2.core", "End " + this.element);
		},
    	
    	//<strong>analyze</strong>: The <code><pre>analyze(callback, options)</pre></code> function is one of the three
		//main functions of this library. Analyze iterates over all registered connectors and
		//let them analyse and enrich with semantic entites. 
		//There are two ways of accessing the extracted knowledge:
		
		//1.  Via the callback method, e.g., <code><pre>.vie2('analyze', function () {
		//    var entities = $(this).vie2('filter', 'entity');
		//})</pre></code>
		//2.  By registering to the 'contextchanged' event, e.g., <code><pre>.bind('vie2contextchanged', function () {
		//    var entities = $(this).vie2('filter', 'entity');
		//})</pre></code>
		analyze: function (callback, options) {
			jQuery.VIE2.log("info", "VIE2.core", "Start analyze!");
			var that = this;
			var queue = [];
			
			jQuery.each(jQuery.VIE2.connectors, function () {
				queue.push(this.id);
 				jQuery.VIE2.log("info", "VIE2.core", "Starting analysis with connector: '" + this.id + "'!");
				var c = function (vie, conn) {
					return function (rdf) {
						jQuery.each(vie.options.namespaces, function(k, v) {
							rdf.prefix(k, v);
						});
						vie._context[conn.id] = rdf;
						jQuery.VIE2.log("info", "VIE2.core", "Received RDF annotation from connector '" + conn.id + "'!");
						removeElement(queue, conn.id);
						//everytime we receive annotations from each connector, we remove the connector's id from the
						//queue and check whether the queue is empty.
						if (queue.length === 0) {
							//if the queue is empty, all connectors have successfully returned and we can call the
							//callback function, as well as we can trigger the contextchanged event.
							jQuery.VIE2.log("info", "VIE2.core", "Finished task: 'analyze'!");
							that._trigger("contextchanged", null, {});
							callback.call(that.element);
						}
					};
				}(that, this);
				//start analysis with the connector.
				this.analyze(that.element, that.options.namespaces, c);
				
			});
		},
		
		//<strong>filter</strong>: The filter function searches through the list of registered mappings and
		//if a mapping class with the corresponding <code>id</code> is found, the filter function of that
		//mapping is called. The result is first of all stored in the local _matches and returned as well.
		//If no matches could be found, or no filter with the given ID is registered, an empty array is returned.
		filter: function (filterId) {
			if (filterId === undefined) {
				jQuery.VIE2.log("warn", "VIE2.core", "Invoked 'filter' with undefined argument!");
				return [];
			} else if (typeof filterId === 'string') {
				var that = this;
				this._oldMatches = this._matches;
				this._matches = [];
				var foundMapping = false;
				var matches = [];
				$.each (jQuery.VIE2.mappings, function () {
					if (this.id === filterId) {
						foundMapping = true;
						jQuery.VIE2.log("info", "VIE2.core", "Invoking mapping '" + this.id + "'!");
						matches = this.filter(that, that._context, that._oldMatches);
						that._matches = matches;
					}
				});
				if (!foundMapping) {
					jQuery.VIE2.log("warn", "VIE2.core", "filer(): Found no mapping with name '" + filterId + "'!");
					return [];
				} else {
					return matches;
				}
			} else {
				jQuery.VIE2.log("warn", "VIE2.core", "Invoked 'filter' with wrong argument: '" + filterId + "'!");
				return [];
			}
		},
		
		//<strong>query</strong>: The query function supports querying for properties. The uri needs
		//to be of type <code>jQuery.rdf</code> object and the property is either an array of strings
		//or a simple string. The function iterates over all connectors that have <code>query()</code>
		//implemented and collects data in an object.
		query: function (uri, props) {
			var ret = {};
			if (uri === undefined) {
				jQuery.VIE2.log("warn", "VIE2.core", "Invoked 'query' with undefined argument!");
			}
			if (uri instanceof jQuery.rdf.resource &&
					uri.type === 'uri') {
				var that = this;

				jQuery.each(props, function () {
					ret[this] = [];
				});

				jQuery.each(jQuery.VIE2.connectors, function () {
					var retTmp = this.query(uri, props);
					if (retTmp) {
						jQuery.extend(ret, retTmp);
					}

				});
			}
			return ret;
		},
		
		//<strong>matches</strong>: A convenience method to access the matches from the last <pre>filter()</pre call.
		matches: function () {
			return this._matches;
		},
		
		//<strong>context</strong>: A convenience method to access the private object <pre>_context</pre>.
		context: function (connId) {
			if (this._context[connId]) {
				return this._context[connId];
			}
		},
		
		//<strong>undo</strong>: Reverts the last <pre>filter()</pre> call.
		undo: function () {
			this._matches = this._oldMatches;
			this._oldMatches = [];
			return this;
		},
		
		//<strong>clear</strong>: Clears the local context, the matches and oldMatches.
		clear: function () {
			this._matches = [];
			this._oldMatches = [];
			this._context = {};
			return this;
		}
		
	});
}(jQuery));

//<strong>$.VIE2.log</strong>: Static convenience method for logging.
jQuery.VIE2.log = function (level, component, message) {
	switch (level) {
	case "info":
		console.info(component + ' ' + message);
		break;
	case "warn":
		console.warn(component + ' ' + message);
		break;
	case "error":
		console.error(component + ' ' + message);
		break;
	}
}

//<strong>$.VIE2.connectors</strong>: Static array of all registered connectors.
jQuery.VIE2.connectors = [];

//<strong>$.VIE2.registerConnector</strong>: Static method to register a connector (is automatically called 
//during construction of connector class.
jQuery.VIE2.registerConnector = function (connector) {
	//first check if there is already 
	//a connector with 'connector.id' registered
	var register = true;
	jQuery.each(jQuery.VIE2.connectors, function () {
		if (this.id === connector.id) {
			register = false;
			return false;
		}
	});
	if (register) {
		jQuery.VIE2.connectors.push(connector);
		jQuery.VIE2.log("info", "VIE2.core", "Registered connector '" + connector.id + "'");
	} else {
		jQuery.VIE2.log("warn", "VIE2.core", "Did not register connector, as there is" +
				"already a connector with the same id registered.");
	}
}

//<strong>$.VIE2.unregisterConnector</strong>: Unregistering of connectors. There is currently
//no usecase for that, but it wasn't that hard to implement it ;)
jQuery.VIE2.unregisterConnector = function (connector) {
	jQuery.each(jQuery.VIE2.connectors, function () {
		if (this.id === connector.id) {
			jQuery.VIE2.connectors.splice(index, 1);
			jQuery.VIE2.log("info", "VIE2.core", "De-registered connector '" + connector.id + "'");
			return false;
		}
	});
}

//<strong>$.VIE2.mappings</strong>: Static array of all registered mappings.
jQuery.VIE2.mappings = [];

//<strong>$.VIE2.registerMapping</strong>: Static method to register a mapping (is automatically called 
//during construction of mapping class.
jQuery.VIE2.registerMapping = function (mapping) {
	//first check if there is already 
	//a mapping with 'mapping.id' registered
	var register = true;
	jQuery.each(jQuery.VIE2.mappings, function () {
		if (this.id === mapping.id) {
			register = false;
			return;
		}
	});
	if (register) {
		jQuery.VIE2.mappings.push(mapping);
		jQuery.VIE2.log("info", "VIE2.core", "Registered mapping '" + mapping.id + "'");
	} else {
		jQuery.VIE2.log("warn", "VIE2.core", "Did not register mapping, as there is" +
				"already a mapping with the same id registered.");
	}
}

//<strong>$.VIE2.unregisterMapping</strong>: Unregistering of mappings. There is currently
//no usecase for that, but it wasn't that hard to implement it ;)
jQuery.VIE2.unregisterMapping = function (mapping) {
	jQuery.each(jQuery.VIE2.mappings, function (index) {
		if (this.id === mapping.id) {
			jQuery.VIE2.mappings.splice(index, 1);
			jQuery.VIE2.log("info", "VIE2.core", "De-registered mapping '" + mapping.id + "'");
			return;
		}
	});
}