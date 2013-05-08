
module('tags', function(dom) {

function tags(tag, options, children) {
	var element = tag == 'fragment' ?
		dom.document.createDocumentFragment() :
		dom.document.createElement(tag)

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
			element.appendChild(dom.document.createTextNode(children[i]))

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
			if(typeof c != 'object')
				c = dom.document.createTextNode(c)
			
			parent.appendChild(c)
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
