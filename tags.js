(function() {

each = function(obj, f)
{
	if(obj instanceof Array)
		for(var i = 0; i < obj.length; i++)
			f(obj[i], i, obj)
	else
		for(var i in obj)
			f(obj[i], i, obj)
}

range = function()
{
	var r = [],
		step = 1,
		start = 0,
		end = 0

	switch(arguments.length)
	{
		case 1:
			end = arguments[0]
			break
		case 2:
			start = arguments[0]
			end = arguments[1]
			break
		case 3:
			start = arguments[0]
			end = arguments[1]
			step = arguments[2]
			break
	}
	
	for(var i = start; i < end; i += step)
		r.push(i)

	return r
}

})()



var module = function() {

var module = function(name, fn)
{
	// First, we extract the notloaded module names from the
	// function definition
	var fn_str = fn.toString()
	var deps = fn_str.slice(fn_str.indexOf('(') + 1, fn_str.indexOf(')'))
	deps = deps.split(',').map(function(arg) 
		{ 
			return arg.trim() 
		})

	if(deps[0] == '') 
		deps = []

	var notloaded = deps.filter(function(d)
		{
			return module.loaded[d] == undefined
		})

	var defined =
	{
		name: name,
		deps: deps,
		fn: fn
	}

	var run = function(m)
	{
		var require = function(name)
		{
			return module.loaded[name].exports
		}

		module.loaded[m.name] = m

		var deps = m.deps.map(function(d) { return module.loaded[d].exports })

		m.exports = m.fn.apply(m, deps)

		each(module.waiting_on[m.name], function(n)
			{
				n.waiting_on.splice(n.waiting_on.indexOf(m.name), 1)
				if(n.waiting_on.length == 0)
					run(n)
			})

		delete module.waiting_on[m.name]
	}
	
	if(notloaded.length == 0)
	{
		run(defined)
	}
	else
	{
		defined.waiting_on = notloaded

		each(notloaded, function(r)
			{
				if(module.waiting_on[r] == undefined)
					module.waiting_on[r] = []

				module.waiting_on[r].push(defined)
			})
	}
}

module.loaded = {}
module.waiting_on = {}

return module
}()


module('tags', function(dom) {

function tags(tag, options, children) {
	var element = document.createElement(tag)

	for(var i in options)
		element.setAttribute(i, options[i])


	for(var i in children)
		if(typeof children[i] == 'object')
		{
			element.appendChild(children[i])

			var name = children[i].getAttribute('name')
			if(name != undefined)
				element['$' + name] = children[i]
		}
		else if(children[i] == undefined) continue
		else
			element.appendChild(document.createTextNode(children[i]))

	return element
}

var text_tags = ['html', 'div', 'p', 'input', 'body', 'a', 'textarea', 'canvas',
	'td', 'tr', 'table', 'fieldset', 'form', 'legend', 'caption',
	'span']

each(text_tags, function(tag) 
	{ 
		tags[tag] = function(options) 
		{ 
			var children = Array.prototype.slice.call(arguments)

			if(typeof options != undefined)
				children = children.slice(1)

			return tags(tag, options, children) 
		} 
	})

return tags
})

window.onload = function()
{
	module('dom', function() 
		{
			return {
					document: document,
					body: document.getElementsByTagName('body')[0]
				}
		})
}
