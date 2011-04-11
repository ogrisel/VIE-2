if(typeof VIE2=="undefined"||!VIE2){VIE2={}}if(typeof VIE2.Util=="undefined"||!VIE2.Util){VIE2.Util={}}VIE2.Util.removeElement=function(a,b){if(jQuery.isArray(a)){jQuery.each(a,function(c){if(a[c]===b){a.splice(c,1);return false}})}};VIE2.Util.PseudoGuid=new (function(){this.empty="VIE2-00000000-0000-0000-0000-000000000000";this.GetNew=function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1).toUpperCase()};return("VIE2-"+a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())}})();VIE2.Util.isCurie=function(a){return !a.substring(0,1).match(/^<$/)&&!(a.substring(0,7).match(/^http:\/\/$/))};VIE2.Util.isLiteral=function(d){try{$.rdf.resource(d,{namespaces:VIE2.namespaces});return false}catch(c){try{$.rdf.blank(d,{namespaces:VIE2.namespaces});return false}catch(b){try{$.rdf.literal(d,{namespaces:VIE2.namespaces});return true}catch(a){return false}}}};VIE2.Util.isBlank=function(c){try{$.rdf.resource(c,{namespaces:VIE2.namespaces});return false}catch(b){try{$.rdf.blank(c,{namespaces:VIE2.namespaces});return true}catch(a){return false}}};if(typeof VIE2=="undefined"||!VIE2){VIE2={}}VIE2.Connector=function(b,a){if(b===undefined||typeof b!=="string"){throw"The connector constructor needs an 'id' of type 'string'!"}this.id=b;this._options=(a)?a:{};VIE2.registerConnector(this)};VIE2.Connector.prototype.options=function(a){if(typeof a==="string"){return this._options[a]}else{if(typeof a==="object"){jQuery.extend(true,this._options,a)}else{return this._options}}};VIE2.Connector.prototype.analyze=function(b,a){VIE2.log("info","VIE2.Connector("+this.id+")#analyze()","Not overwritten!");if(a&&a.success){a.success.call(this,jQuery.rdf())}};VIE2.Connector.prototype.query=function(b,a,c){VIE2.log("info","VIE2.Connector("+this.id+")#query()","Not overwritten!");c.call(this,{})};if(typeof VIE2=="undefined"||!VIE2){VIE2={}}VIE2.Mapping=function(h,c,f,a){if(h===undefined){throw"The mapping constructor needs an 'id'!"}if(typeof h!=="string"){throw"The mapping constructor needs an 'id' of type 'string'!"}if(c===undefined){throw"The mapping constructor needs 'types'!"}this.id=h;this.options=(a)?a:{};if(this.options.namespaces){jQuery.each(this.options.namespaces,function(i,d){VIE2.namespaces[i]=d;VIE2.globalCache.prefix(i,d)})}this.types=[];for(var b=0;b<c.length;b++){var e=c[b];if(!VIE2.Util.isCurie(e)){e=jQuery.createCurie(e.replace(/^</,"").replace(/>$/,""),{namespaces:VIE2.namespaces,charcase:"lower"}).toString()}this.types.push(e)}this.defaults=[];for(var b=0;b<f.length;b++){var g=f[b];if(!VIE2.Util.isCurie(g)){g=jQuery.createCurie(g.replace(/^</,"").replace(/>$/,""),{namespaces:VIE2.namespaces,charcase:"lower"}).toString()}this.defaults.push(g)}VIE2.registerMapping(this)};if(typeof VIE2=="undefined"||!VIE2){VIE2={}}VIE2.Collection=VIE.RDFEntityCollection.extend({add:function(b,a){VIE.RDFEntityCollection.prototype.add.call(this,b,a)},remove:function(b,a){VIE.RDFEntityCollection.prototype.remove.call(this,b,a)}});if(typeof VIE2=="undefined"||!VIE2){VIE2={}}VIE2.Entity=VIE.RDFEntity.extend({addAValue:function(b,a){VIE2.addProperty(this.getSubject(),b,a);this.trigger("change:"+b);this.change()},changeAValue:function(c,b,a){VIE2.changeProperty(this.getSubject(),c,b,a);this.trigger("change:"+c);this.change()},removeAValue:function(b,a){VIE2.removeProperty(this.getSubject(),b,a);this.trigger("change:"+b);this.change()},get:function(a){if(a==="id"){return VIE.RDFEntity.prototype.get.call(this,a)}return VIE2.getFromGlobalCache(this.getSubject(),a)},set:function(a,c){if("id" in a){this.id=a.id}var b=this;jQuery.each(a,function(e,d){if(e!=="id"&&e!=="a"){VIE2.removeProperty(b.getSubject(),e);if(!jQuery.isArray(d)){d=[d]}VIE2.addProperty(b.getSubject(),e,d);b.trigger("change:"+e)}else{var f={};f[e]=d;VIE.RDFEntity.prototype.set.call(b,f,c)}});this.change()},unset:function(b,a){VIE2.removeProperty(this.getSubject(),b,"?x");if(!a.silent){this.trigger("change:"+b);this.change()}},destroy:function(a){VIE.RDFEntity.prototype.destroy.call(this,a)},clear:function(b){var a=this;jQuery.each(this.attributes,function(c){if(c!=="a"&&c!=="id"){a.unset(c)}})},fetch:function(a){VIE.RDFEntity.prototype.fetch.call(a)},save:function(a,b){VIE.RDFEntity.prototype.save.call(a,b)},validate:function(a){VIE.RDFEntity.prototype.validate.call(a)}});VIE.EntityManager.initializeCollection();(function(a,b){a.widget("VIE2.vie2",{options:{entities:[]},_create:function(){var c=this;jQuery.each(jQuery("html").xmlns(),function(f,e){VIE2.namespaces[f]=e.toString();VIE2.globalCache.prefix(f,e)});try{jQuery.each(this.element.xmlns(),function(f,e){VIE2.namespaces[f]=e.toString();VIE2.globalCache.prefix(f,e)})}catch(d){if(this.element.get(0)!==document){VIE2.log("warn","VIE2.core#create()","Could not retrieve namespaces from element: '"+d+"'!")}}},analyze:function(f,c){var e=this;if(f===b){VIE2.log("warn","VIE2.core#analyze()","No callback method specified!")}VIE2.log("info","VIE2.core#analyze()","Started.");var d=[];jQuery.each(VIE2.connectors,function(){if(c&&c.connectors){if(c.connectors.indexOf(this.id)!==-1){d.push(this.id)}}else{d.push(this.id)}});jQuery.each(VIE2.connectors,function(){var g=function(i){return function(j){VIE2.log("info","VIE2.core#analyze()","Received RDF annotation from connector '"+this.id+"'!");jQuery.each(VIE2.namespaces,function(m,l){j.prefix(m,l)});j.databank.triples().each(function(){VIE2.globalCache.add(this)});jQuery.each(j.databank.subjectIndex,function(m,l){var k=m.toString();if(e.options.entities.indexOf(k)===-1){e.options.entities.push(k)}VIE2.registerModel({id:k})});VIE2.Util.removeElement(d,this.id);if(d.length===0){VIE2.log("info","VIE2.core#analyze()","Finished! Global Cache holds now "+VIE2.globalCache.databank.triples().length+" triples!");VIE2.log("info","VIE2.core#analyze()","Finished! Local element holds now "+e.options.entities.length+" entities!");if(f){f.call(i,"ok")}}}}(e.element);var h=function(i){VIE2.log("error","VIE2.core#analyze()","Connector "+this.id+") returned with the following error: '"+i+"'!");VIE2.Util.removeElement(d,this.id)};if(c&&c.connectors){if(c.connectors.indexOf(this.id)!==-1){VIE2.log("info","VIE2.core#analyze()","Starting analysis with connector: '"+this.id+"'!");this.analyze(e.element,{success:g,error:h})}else{VIE2.log("info","VIE2.core#analyze()","Will not use connector "+this.id+" as it is filtered!")}}else{VIE2.log("info","VIE2.core#analyze()","Starting analysis with connector: '"+this.id+"'!");this.analyze(e.element,{success:g,error:h})}})},uris:function(){return this.options.entities},copy:function(c){var d=this;if(!c){VIE2.log("warn","VIE2.core#copy()","Invoked 'copy()' without target element!");return}VIE2.log("info","VIE2.core#copy()","Start.");VIE2.log("info","VIE2.core#copy()","Found "+this.options.entities.length+" entities for source.");a(c).vie2().vie2("option","entities",this.options.entities);VIE2.log("info","VIE2.core#copy()","Finished.");VIE2.log("info","VIE2.core#copy()","Target element has now "+a(c).vie2("option","entities")+" entities.");return this},clear:function(){this.options.entities={};return this}})}(jQuery));if(typeof VIE2=="undefined"||!VIE2){VIE2={}}VIE2.namespaces={};VIE2.globalCache=jQuery.rdf({namespaces:VIE2.namespaces});VIE2.clearCache=function(){VIE2.globalCache=jQuery.rdf({namespaces:VIE2.namespaces})};VIE2.getFromGlobalCache=function(b,c){var a=[];VIE2.globalCache.where(jQuery.rdf.pattern(b,c,"?object",{namespaces:VIE2.namespaces})).each(function(){if(this.object.type){if(this.object.type==="literal"){a.push(this.object.value.toString())}else{if(this.object.type==="uri"||this.object.type==="bnode"){if(VIE.EntityManager.getBySubject(this.object.toString())!==undefined){a.push(VIE.EntityManager.getBySubject(this.object.toString()))}else{a.push(this.object.toString())}}}}});return a};VIE2.addProperty=function(d,f,a){if(d===undefined){VIE2.log("warn","VIE2.addProperty()","No URI specified, returning without action!");return}if(f===undefined){VIE2.log("warn","VIE2.addProperty()","No property specified, returning without action!");return}if(a===undefined){VIE2.log("warn","VIE2.addProperty()","No values specified, returning without action!");return}if(typeof a==="string"){return VIE2.addProperty(d,f,[a])}for(var c=0;c<a.length;c++){var b;if(VIE2.Util.isLiteral(a[c])){b=jQuery.rdf.literal(a[c],{namespaces:VIE2.namespaces});if(!b.datatype){if(!b.lang){b.lang="en"}}}else{if(VIE2.Util.isBlank(a[c])){b=jQuery.rdf.blank(a[c],{namespaces:VIE2.namespaces})}else{b=jQuery.rdf.resource(a[c],{namespaces:VIE2.namespaces})}}var e=jQuery.rdf.triple(d,f,b,{namespaces:VIE2.namespaces});VIE2.log("info","VIE2.addProperty()","Adding new triple: '"+e+"'.");VIE2.globalCache.add(e)}VIE2.log("info","VIE2.addProperty()","Global Cache holds now "+VIE2.globalCache.databank.triples().length+" triples!")};VIE2.changeProperty=function(b,d,a,c){};VIE2.removeProperty=function(a,d,c){if(a===undefined){VIE2.log("warn","VIE2.removeProperty()","No URI specified, returning without action!");return}if(d===undefined){VIE2.log("warn","VIE2.removeProperty()","No property specified, returning without action!");return}if(c===undefined){VIE2.log("warn","VIE2.removeProperty()","No value specified, returning without action!");return}VIE2.log("info","VIE2.removeProperty()","Global Cache holds now "+VIE2.globalCache.databank.triples().length+" triples!");var b=jQuery.rdf.pattern(a+" "+d+" "+c,{namespaces:VIE2.namespaces});VIE2.log("info","VIE2.removeProperty()","Removing all triples that match: '"+b+"'");VIE2.globalCache.where(b).remove(b);VIE2.log("info","VIE2.removeProperty()","Global Cache holds now "+VIE2.globalCache.databank.triples().length+" triples!")};VIE2.lookup=function(e,d,f){VIE2.log("info","VIE2.lookup()","Start!");if(e===undefined||typeof e!=="string"||d===undefined){VIE2.log("warn","VIE2.lookup()","Invoked 'query()' with wrong/undefined argument(s)!");f.call(e,a);return}if(!jQuery.isArray(d)){VIE2.lookup(e,[d],f,options);return}var a={};for(var b=0;b<d.length;b++){a[d[b]]=[]}var c=[];jQuery.each(VIE2.connectors,function(){c.push(this.id)});jQuery.each(VIE2.connectors,function(){VIE2.log("info","VIE2.lookup()","Start with connector '"+this.id+"' for uri '"+e+"'!");var g=function(i,h,j){return function(k){VIE2.log("info","VIE2.lookup()","Received query information from connector '"+this.id+"' for uri '"+i+"'!");jQuery.each(k,function(m,l){for(var n=0;n<l.length;n++){var o=jQuery.rdf.triple(i,m,l[n],{namespaces:VIE2.namespaces});VIE2.globalCache.add(o)}});VIE2.Util.removeElement(c,this.id);if(c.length===0){jQuery.each(h,function(l){VIE2.globalCache.where(i+" "+l+" ?x").each(function(){var m=this.x.toString();if(h[l].indexOf(m)===-1){h[l].push(m)}})});VIE2.log("info","VIE2.lookup()","Finished task: 'query()' for uri '"+i+"'!");VIE2.log("info","VIE2.lookup()","Global Cache now holds "+VIE2.globalCache.databank.triples().length+" triples!");j.call(i,h)}}}(e,a,f);this.query(e,d,g)})};VIE2.mappings={};VIE2.registerModel=function(a,d){VIE2.log("info","VIE2.registerModel()","Start ("+a.id+")!");var b=VIE.EntityManager.getBySubject(a.id);if(b!==undefined){VIE2.log("info","VIE2.registerModel()","Entity "+a.id+" already registered, no need to add it.");VIE2.log("info","VIE2.registerModel()","But we better check if there is a collection where we have to add it to.");jQuery.each(VIE2.mappings,function(f,h){var g=false;jQuery.each(h.a,function(){if(jQuery.inArray(this.toString(),a.a)!==-1){g=true;return false}});if(g&&h.collection.indexOf(b)===-1){h.collection.add(b)}});if(d){d.call(b)}}else{var c=function(e){var h=[];if(e.a){for(var g=0;g<e.a.length;g++){if(!VIE2.Util.isCurie(e.a[g])){var j=jQuery.createCurie(e.a[g].replace(/^</,"").replace(/>$/,""),{namespaces:VIE2.namespaces,charcase:"lower"}).toString();h.push(j)}else{h.push(e.a[g])}}}if(a.a){if(jQuery.isArray(a.a)){for(var g=0;g<a.a.length;g++){if(!VIE2.Util.isCurie(a.a[g])){var j=jQuery.createCurie(a.a[g].replace(/^</,"").replace(/>$/,""),{namespaces:VIE2.namespaces,charcase:"lower"}).toString();h.push(j)}else{h.push(a.a[g])}}}else{if(typeof a.a==="string"){if(!VIE2.Util.isCurie(a.a)){var j=jQuery.createCurie(a.a.replace(/^</,"").replace(/>$/,""),{namespaces:VIE2.namespaces,charcase:"lower"}).toString();h.push(j)}else{h.push(a.a)}}}}VIE2.log("info","VIE2.registerModel()","Entity "+a.id+" of type(s) ["+h.join(", ")+"] needs to be registered as a backbone model.");var f=new VIE2.Entity(a);var k=f.getSubject();jQuery.each(VIE2.mappings,function(n,m){var o=false;for(var l=0;l<h.length;l++){if(m.a.indexOf(h[l])!==-1){o=true;break}}if(o){VIE2.log("info","VIE2.registerModel()","Registered a backbone model for '"+k+"'.");var p=m.collection.model;jQuery.each(a,function(q,i){if(q!=="id"){VIE2.addProperty(k,q,i)}});VIE.EntityManager.registerModel(f);m.collection.add(f);VIE2.log("info","VIE2.registerModel()","Added entity '"+k+"' to collection of type '"+n+"'!");var m=m.mapping;VIE2.log("info","VIE2.registerModel()","Querying for default properties for entity '"+a.id+"': ["+m.defaults.join(", ")+"]!");VIE2.lookup(f.getSubject(),m.defaults,function(q,i){return function(){VIE2.log("info","VIE2.registerModel()","Finished querying for default properties for entity '"+i.getSubject()+"': ["+q.join(", ")+"]!");for(var r=0;r<q.length;r++){i.trigger("change:"+q[r])}i.change()}}(m.defaults,f))}else{VIE2.log("info","VIE2.registerModel()","Entity '"+a.id+"' does not belong to collection of type "+n+"!")}});if(d){d.call(f)}};VIE2.lookup(a.id,["a"],c)}};VIE2.registerMapping=function(a){if(!VIE2.mappings[a.id]){VIE2.log("info","VIE2.registerMapping()","Registered mapping '"+a.id+"'");var b=VIE2.Collection.extend({model:VIE2.Entity});VIE2.mappings[a.id]={a:(jQuery.isArray(a.types))?a.types:[a.types],collection:new b(),mapping:a};VIE2.log("info","VIE2.registerMapping()","Registered mapping '"+a.id+"' finished!")}else{VIE2.log("warn","VIE2.registerMapping()","Did not register mapping, as there isalready a mapping with the same id registered.")}};VIE2.unregisterMapping=function(a){VIE2.mappings[a]=undefined};VIE2.connectors={};VIE2.registerConnector=function(a){if(!VIE2.connectors[a.id]){VIE2.connectors[a.id]=a;if(a.options("namespaces")){jQuery.each(a.options("namespaces"),function(c,b){VIE2.namespaces[c]=b;VIE2.globalCache.prefix(c,b)})}VIE2.log("info","VIE2.registerConnector()","Registered connector '"+a.id+"'")}else{VIE2.log("warn","VIE2.registerConnector()","Did not register connector, as there isalready a connector with the same id registered.")}};VIE2.unregisterConnector=function(a){VIE2.connectors[connector.id]=undefined};VIE2.logLevels=["info","warn","error"];VIE2.log=function(c,a,b){if(VIE2.logLevels.indexOf(c)>-1){switch(c){case"info":console.info(a+" "+b);break;case"warn":console.warn(a+" "+b);break;case"error":console.error(a+" "+b);break}}};jQuery(document).vie2();