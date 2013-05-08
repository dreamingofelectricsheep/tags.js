
module('tags', function(dom) {

function bind(element, child)
{
	if(typeof child != 'object')
		child = dom.document.createTextNode(child)


	element.appendChild(child)

	if(child.getAttribute)
	{
		var name = child.getAttribute('name')

		if(name != undefined)
			element['$' + name] = child
	}
}

function tags(tag, options, children) {
	var element = tag == 'fragment' ?
		dom.document.createDocumentFragment() :
		dom.document.createElement(tag)

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
	'fragment',	'span', 'ul', 'li']

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

tags.body = dom.body

tags.append = function(parent)
{
	var children = Array.prototype.slice.call(arguments, 1)

	each(children, function(c)
		{
			bind(parent, c)
		})

	return parent
}

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
