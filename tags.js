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

(function() {
	for(var i in arguments)
		(function(tag) { 
			tags[tag] = function(options) { 
				var children = Array.prototype.slice.call(arguments)

				if(typeof options != undefined)
					children = children.slice(1)

				return tags(tag, options, children) 
			} 
		})(arguments[i])
})('html', 'div', 'p', 'input', 'body', 'a', 'textarea', 'canvas',
	'td', 'tr', 'table', 'fieldset', 'form', 'legend', 'caption',
	'span')
