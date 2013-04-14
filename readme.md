# Tags.js

An incredibly simple library to speed up some things I've
found myself copying between repositories without an ounce
of organisation.

Since I believe in serving all javascript concatenated with the
html, there is no mechanism for hot loading modules from the
server.


# Example code

```javascript
module('new_module', function(tags, dom)
{
	var body = dom.body

	body.appendChild(
		tags.div({ class: 'test-div', id: 'id' },
			tags.input({ placeholder: 'Type something in here' }),
			'And a bit of text for good measure'))

	return function() { alert("I'm an exported function!") }
})

module('other_module', function(new_module)
{
	new_module()

	return { one: 'hello', two: 'world' }
})

module('module_with_optional_dependencies', function(require)
	var optional = require('other_module')

	if(optional != undefined)
		alert(optional.one + ' ' + optional.two)
})
```
