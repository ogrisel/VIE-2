Connector=function(b,a){if(b===undefined){throw"The connector constructor needs an 'id'!"}if(typeof b!=="string"){throw"The connector constructor needs an 'id' of type 'string'!"}this.id=b;this._options=(a)?a:{};jQuery.VIE2.registerConnector(this)};Connector.prototype.options=function(a){if(a){jQuery.extend(true,this._options,a)}else{return this._options}};Connector.prototype.analyze=function(a,b,c){jQuery.VIE2.log("info","VIE2.Connector("+this.id+")#analyze()","Not overwritten!");c(jQuery.rdf())};Connector.prototype.query=function(b,a,c,d){jQuery.VIE2.log("info","VIE2.Connector("+this.id+")#query()","Not overwritten!");d({})};Connector.prototype.annotate=function(a,c,b,d){jQuery.VIE2.log("info","VIE2.Connector("+this.id+")#annotate()","Not overwritten!");d({})};Connector.prototype.remove=function(a,c,b,d){jQuery.VIE2.log("info","VIE2.Connector("+this.id+")#remove()","Not overwritten!");d({})};Mapping=function(c,a,b){if(c===undefined){throw"The mapping constructor needs an 'id'!"}if(typeof c!=="string"){throw"The mapping constructor needs an 'id' of type 'string'!"}if(a===undefined){throw"The mapping constructor needs 'types'!"}this.id=c;this.types=a;this.defaultProps=(b)?b:[];jQuery.VIE2.registerMapping(this)};(function(a,b){a.widget("VIE2.vie2",{options:{localContext:jQuery.rdf()},_create:function(){var d=this;jQuery.each(jQuery("html").xmlns(),function(f,e){jQuery.VIE2.namespaces[f]=e.toString()});jQuery.each(jQuery.VIE2.connectors,function(){if(this.options()["namespaces"]){jQuery.each(this.options()["namespaces"],function(f,e){jQuery.VIE2.namespaces[f]=e})}});if(!d.element.data("vie2-id")){jQuery.VIE2.log("warn","VIE2.core#analyze()","No element id specified, generate one dynamically and add it!");var c=PseudoGuid.GetNew();jQuery.VIE2.log("warn","VIE2.core#analyze()","Generated id: '"+c+"'!");d.element.data("vie2-id",c)}this._initNamespaces(jQuery.VIE2.globalContext)},_setOption:function(c,d){if(c==="namespaces"){jQuery.extend(true,jQuery.VIE2.namespaces,d);this._initNamespaces(jQuery.VIE2.globalContext);this._initNamespaces(this.options.localContext)}else{jQuery.Widget.prototype._setOption.apply(this,[c,d])}},_initNamespaces:function(c){jQuery.each(jQuery.VIE2.namespaces,function(e,d){c.prefix(e,d)})},analyze:function(e){var d=this;if(e===b){jQuery.VIE2.log("warn","VIE2.core#analyze()","No callback method specified!")}jQuery.VIE2.log("info","VIE2.core#analyze()","Start.");var c=[];jQuery.each(jQuery.VIE2.connectors,function(){c.push(this.id)});jQuery.each(jQuery.VIE2.connectors,function(){var f=function(h,g){return function(i){jQuery.VIE2.log("info","VIE2.core#analyze()","Received RDF annotation from connector '"+h.id+"'!");d._initNamespaces(i);i.databank.triples().each(function(){jQuery.VIE2.globalContext.add(this);d.options.localContext.add(this)});jQuery.each(i.databank.subjectIndex,function(l,j){var k=[];i.where(l+" a ?type").each(function(){var m=jQuery.createCurie(this.type.value,{namespaces:jQuery.VIE2.namespaces});k.push(m)});jQuery.VIE2.addBBEntity({id:l,a:k})});removeElement(c,h.id);if(c.length===0){jQuery.VIE2.log("info","VIE2.core#analyze()","Finished! Global context holds now "+jQuery.VIE2.globalContext.databank.triples().length+" triples!");if(e){e.call(g,"ok")}}}}(this,d.element);jQuery.VIE2.log("info","VIE2.core#analyze()","Starting analysis with connector: '"+this.id+"'!");this.analyze(d.element,d.options.namespaces,f)})},annotate:function(f){var e=this;var d=this.element;if(f===b){jQuery.VIE2.log("warn","VIE2.core#annotate()","No triple specified, returning without action!");return this}var c=jQuery.rdf({namespaces:jQuery.VIE2.namespaces});if(!jQuery.isArray(f)){return this.annotate([f],d)}else{jQuery.each(f,function(h,g){var j=f[h];if(typeof j==="string"){j=jQuery.rdf.triple(j,{namespaces:jQuery.VIE2.namespaces})}else{}c.add(j)})}jQuery.VIE2.log("info","VIE2.core#annotate()","Start.");c.databank.triples().each(function(){jQuery.VIE2.globalContext.add(this)});if(d){if(!e.options.localContext){e.options.localContext=c}else{c.databank.triples().each(function(){e.options.localContext.add(this)})}}jQuery.each(c.databank.subjectIndex,function(h,g){var i=this;jQuery.each(i,function(j){var k=i[j];jQuery.each(jQuery.VIE2.Backbone,function(m,l){var o=this["collection"].get(h.toString());if(o){var n=jQuery.createCurie(k.property.value,{namespaces:jQuery.VIE2.namespaces});if(o.defaults[n]){o.trigger("change:"+n);o.change();jQuery.VIE2.log("info","VIE2.core#annotate()","Added value to entity '"+o.id+"' '"+n+"' '"+k.object.toString()+"'!")}}})})});jQuery.each(c.databank.subjectIndex,function(i,g){var h=[];c.where(i+" a ?type").each(function(){var j=jQuery.createCurie(this.type.value,{namespaces:jQuery.VIE2.namespaces});h.push(j)});jQuery.VIE2.addBBEntity({id:i,a:h})});jQuery.VIE2.log("info","VIE2.core#annotate()","End.");jQuery.VIE2.log("info","VIE2.core#annotate()","Global context holds now "+jQuery.VIE2.globalContext.databank.triples().length+" triples!");if(d!==b){jQuery.VIE2.log("info","VIE2.core#annotate()","Local cache of element '"+d.data("vie2-id")+"' holds now "+e.options.localContext.databank.triples().length+" triples!")}return this},get:function(e,f){var c=[];var d=this;d.options.localContext.where(jQuery.rdf.pattern(e,f,"?object",{namespaces:jQuery.VIE2.namespaces})).each(function(){c.push(this.object)});return c},copy:function(c){var d=this;if(!c){jQuery.VIE2.log("warn","VIE2.core#copy()","Invoked 'copy()' without target element!");return}jQuery.VIE2.log("info","VIE2.core#copy()","Start.");jQuery.VIE2.log("info","VIE2.core#copy()","Found "+d.options.localContext.databank.triples().length+" triples for source ("+d.element.data("vie2-id")+").");a(c).vie2().vie2("annotate",d.options.localContext.databank.triples());jQuery.VIE2.log("info","VIE2.core#copy()","Finished.");return this},clear:function(){this.options.localConext={};return this}})}(jQuery));jQuery.VIE2.namespaces={};jQuery.VIE2.globalContext=jQuery.rdf({namespaces:jQuery.VIE2.namespaces});jQuery.VIE2.getFromGlobalContext=function(b,c){var a=[];jQuery.VIE2.globalContext.where(jQuery.rdf.pattern(b,c,"?object",{namespaces:jQuery.VIE2.namespaces})).each(function(){a.push(this.object)});return a};jQuery.VIE2.query=function(f,e,g,b){var a={};jQuery.VIE2.log("info","$.VIE2.query()","Start!");if(f===undefined||e===undefined){jQuery.VIE2.log("warn","$.VIE2.query()","Invoked 'query()' with undefined argument(s)!");g(a);return}else{if(!jQuery.isArray(e)){jQuery.VIE2.query(f,[e],g,b);return}}if(typeof f==="string"&&jQuery.isArray(e)){for(var c=0;c<e.length;c++){a[e[c]]=[]}if(!b||(b&&!b.cache==="nocache")){for(var c=0;c<e.length;c++){jQuery.VIE2.globalContext.where(jQuery.rdf.pattern(f,e[c],"?object",{namespaces:jQuery.VIE2.namespaces})).each(function(){a[e[c]].push(this.object)})}}if(b&&b.cache==="cacheonly"){g(a);return}var d=[];jQuery.each(jQuery.VIE2.connectors,function(){d.push(this.id)});jQuery.each(jQuery.VIE2.connectors,function(){jQuery.VIE2.log("info","$.VIE2.query()","Start with connector '"+this.id+"' for uri '"+f+"'!");var h=function(k,j,i,l){return function(m){jQuery.VIE2.log("info","$.VIE2.query()","Received query information from connector '"+k.id+"' for uri '"+j+"'!");jQuery.extend(true,i,m);removeElement(d,k.id);if(d.length===0){jQuery.each(i,function(o,n){for(var p=0;p<n.length;p++){jQuery.VIE2.globalContext.add(jQuery.rdf.triple(j,o,n[p],{namespaces:jQuery.VIE2.namespaces}))}});jQuery.VIE2.log("info","$.VIE2.query()","Finished task: 'query()' for uri '"+j+"'!");jQuery.VIE2.log("info","$.VIE2.query()","Global context now holds "+jQuery.VIE2.globalContext.databank.triples().length+" triples!");console.log(i);l.call(i)}}}(this,f,a,g);this.query(f,e,jQuery.VIE2.namespaces,h)})}else{g(a)}};jQuery.VIE2.clearContext=function(){jQuery.VIE2.globalContext=jQuery.rdf({namespaces:jQuery.VIE2.namespaces})};jQuery.VIE2.log=function(c,a,b){switch(c){case"info":console.info(a+" "+b);break;case"warn":console.warn(a+" "+b);break;case"error":console.error(a+" "+b);break}};jQuery.VIE2.connectors={};jQuery.VIE2.registerConnector=function(a){if(!jQuery.VIE2.connectors[a.id]){jQuery.VIE2.connectors[a.id]=a;if(a._options.namespaces){jQuery.each(a._options.namespaces,function(c,b){jQuery.VIE2.globalContext.prefix(c,b);$(".VIE2-vie2").vie2("option","localContext").prefix(c,b)})}jQuery.VIE2.log("info","VIE2.core#registerConnector()","Registered connector '"+a.id+"'")}else{jQuery.VIE2.log("warn","VIE2.core#registerConnector()","Did not register connector, as there isalready a connector with the same id registered.")}};jQuery.VIE2.unregisterConnector=function(a){jQuery.VIE2.connectors[connector.id]=undefined};jQuery.VIE2.Backbone={};jQuery.VIE2.Entity=VIE.RDFEntity.extend({lookup:function(a){if(!jQuery.isArray(a)){this.lookup([a])}else{jQuery.VIE2.query(this.id,a,function(b){return function(){jQuery.each(a,function(c){b.trigger("change:"+a[c]);b.change()})}}(this))}},get:function(a){return jQuery.VIE2.getFromGlobalContext(this.id,a)},set:function(a,b){Backbone.Model.prototype.set.call(this,a,b)}});jQuery.VIE2.addBBEntity=function(a){jQuery.each(jQuery.VIE2.Backbone,function(d,g){var f=false;jQuery.each(g.a,function(){var e=jQuery.inArray(this.toString(),a.a);if(jQuery.inArray(this.toString(),a.a)>=0){f=true;return false}});if(f){if(g.collection.get(a.id)){g.collection.get(a.id).change();jQuery.VIE2.log("warn","VIE2.core#addBBEntity()","Entity with id '"+a.id+"' already exists as a backbone model!")}else{var h=g.collection.model;var c=new h(a);g.collection.add(c);jQuery.VIE2.log("info","VIE2.core#addBBEntity()","Added entity '"+a.id+"' to collection of type '"+d+"'!");var b=g.mapping;jQuery.VIE2.log("info","VIE2.core#addBBEntity()","Querying for default properties for entity '"+a.id+"': ["+b.defaultProps.join(", ")+"]!");jQuery.VIE2.query(c.id,b.defaultProps,function(j,i,e){return function(){jQuery.VIE2.log("info","VIE2.core#addBBEntity()","Finished querying for default properties for entity '"+j+"': ["+i.join(", ")+"]!");e.change()}}(a.id,b.defaultProps,c))}}})};jQuery.VIE2.registerMapping=function(a){if(!jQuery.VIE2.Backbone[a.id]){jQuery.VIE2.log("info","VIE2.core#registerMapping()","Registered mapping '"+a.id+"'");var c={};jQuery.each(a.defaultProps,function(e){c[a.defaultProps[e]]=[]});var d=jQuery.VIE2.Entity.extend({defaults:c});var b=VIE.RDFEntityCollection.extend({model:d});jQuery.VIE2.Backbone[a.id]={a:(jQuery.isArray(a.types))?a.types:[a.types],collection:new b(),mapping:a};jQuery.VIE2.log("info","VIE2.core#registerMapping()","Registered mapping '"+a.id+"' finished!")}else{jQuery.VIE2.log("warn","VIE2.core#registerMapping()","Did not register mapping, as there isalready a mapping with the same id registered.")}};jQuery.VIE2.unregisterMapping=function(a){jQuery.VIE2.Backbone[a]=undefined};function removeElement(a,b){if(jQuery.isArray(a)){jQuery.each(a,function(c){if(a[c]===b){a.splice(c,1);return false}})}}var PseudoGuid=new (function(){this.empty="VIE2-00000000-0000-0000-0000-000000000000";this.GetNew=function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1).toUpperCase()};return("VIE2-"+a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())}})();