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
	// First, we extract the required module names from the
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

	// Currently defined module
	var defined =
	{
		name: name,
		deps: deps,
		fn: fn
	}

	// Module execution
	var run = function(m)
	{
		var require = function(name)
		{
			return module.loaded[name].exports
		}

		module.loaded[m.name] = m

		var deps = m.deps.map(function(d) { return module.loaded[d].exports })

		m.exports = m.fn.apply(m, deps)

		// We check whether or not loading current module
		// has solved any dependancies and it so - "run" them
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
		// Queue the module for execution at a later date,
		// once the dependancies are satisfied.
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


