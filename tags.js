
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


function bind(element, child)
{
	if(child == undefined) return

	if(typeof child != 'object')
		child = document.createTextNode(child)


	element.appendChild(child)

	if(child.getAttribute)
	{
		var name = child.getAttribute('name')

		if(name != undefined)
			element['$' + name] = child
	}
}

function tags(tag, options, children)
{
	var element = tag == 'fragment' ?
		document.createDocumentFragment() :
		document.createElement(tag)

	if(element.setAttribute)
		for(var i in options)
		{
			if(i == 'style')
			{
				for(var j in options[i])
					element.style[j] = options[i][j]
			}
			else
			{
				element.setAttribute(i, options[i])
			}
		}


	each(children, 
		function(c)
		{
			bind(element, c)
		})

	return element
}

var text_tags = ['html', 'div', 'p', 'input', 'a', 'textarea', 'canvas',
	'td', 'tr', 'table', 'fieldset', 'form', 'legend', 'caption',
	'fragment',	'span', 'ul', 'li', 'br', 'label']

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


tags.append = function(parent)
{
	var children = Array.prototype.slice.call(arguments, 1)

	each(children, function(c)
		{
			bind(parent, c)
		})

	return parent
}

module.exports = tags
