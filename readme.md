# How to use
## Selection

```
Sel({string|object} selector);
Sel({string|object} selector, {object, default=document} context);
```

Look for items in the context, context should be a valid DOM element.
If context is not provided, document is used instead

### Refining selection
```
Sel(…).find({string} selector);
```

You can refine your current selection using find prototype with a CSS selector.

## Loops
```
Sel(…).each(function({*} index, {*} element){
    var element = this;
});
Poivre.each({array|object} list, function({*} index, {*} value){
    var value = this;
});
```
You can loop between current Selection or loop on a custom list.

Foreach element the callback will be called.

## Ajax
```
Poivre.ajax({
    url: {string},
    method: {string} 'post|get',
    async: {boolean} true|false,
    success: function(responseText, status){
        var request = this;
    },
    error: function(statusText){
        var request = this;
    ),
    statusCode: {
        200: function(responseText, status){
            var request = this;
        }
    },
    data: {string|Array|PlainObject}
});
```

Allow you to create an ajax call


## The Setter and the Getter

### Get
```
    Sel(…).get({string} attribute, {boolean, default=true} attribute);
```
Allow you to get an or a property of a the dom element of your selection.

Examples of usage:
```
    Sel('#selectMe').get('id');
    // return 'selectMe'
```

```
    Sel('#selectMe').get('style');
    // return 'font-size: 10px;'
    
    
    Sel('#selectMe').get('style', true);
    // return {fontSize: '10px'}
```

### Set
```
    Sel(…).set({string} attribute, {object|string} value);
```
Allow you to set an or a property of all your dom elements.

Examples of usage:
```
    Sel('#selectMe').set('id', 'test');
    // Will set the attribute "id" of #selectMe to test
```

```
    Sel('#selectMe').set('style', 'font-size: 10px;');
    // Will set the attribute "style" to 'font-size: 10px;'
    
    
    Sel('#selectMe').set('style', {color: 'red'});
    // Will set the CSS style "color" to red
    //   Sel('#selectMe').get('style');
    //   Will return 'font-size: 10px; color: red;'
```

## Classes
### hasClass
```
    $('.div').hasClass('className');
```
Will return you if the *first* element matching the selector has the Class

### addClass
```
    $('.div').addClass('className');
```
Set class for all elements selected

### removeClass
```
    $('.div').removeClass('className');
```
Remove class for all elements selected

### removeClass
```
    $('.div').removeClass('className');
```
Remove class for all elements selected
