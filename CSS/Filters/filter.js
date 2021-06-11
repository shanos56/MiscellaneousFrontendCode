var filter = {
        
        'isNegative': function () {
            var o = {};
            
            o.execute = function(charcode) {
                return (charcode == 45);
            }
            
            return o;
        },
        
        'isDecimalPoint': function () {
            var o = {};
            
            o.execute = function(charcode) {
                return (charcode == 46);
            }
            return o;
        },
        
        'isNumber': function () {
            var o = {};
            
            o.execute = function(charcode) {
                return (charcode > 47 && charcode < 58);
            }
            return o;
        }
        
        
    }
    
var filters = {
    
    'NumberOnly': function (value) {
        var val = value.split("");
        var filtered = "";
        var hasNegative = false;
        var hasDecimal = false;
        
        for (var i = 0; i < val.length; i++) {
            var char = val[i];
            var charCode = value.charCodeAt(i);
            // using charcodes is quicker than finding the index in a string
            if (filter.isNegative().execute(charCode)) { // char == "-"
                if (i == 0) {
                    hasNegative = true;
                    filtered += char
                }
            } else if (filter.isDecimalPoint().execute(charCode)) { // char == "."
                if (hasDecimal == false) {
                    hasDecimal = true;
                    filtered += char;
                }
            } else if (filter.isNumber().execute(charCode)) {
                filtered += char;
            }
        }
        
        return filtered;
    },
    
    'PositiveIntegerOnly': function (value) {
        
        var val = value.split("");
        var filtered = "";
        
        for (var i = 0; i < val.length; i++) {
            var charCode = value.charCodeAt(i);
            var char = val[i];
            if ( filter.isNumber().execute(charCode)) {
                filtered += char;
            }
        }
        
        return filtered;
    },
    'PositiveDecimalOnly': function (value) {
        var val = value.split("");
        var filtered = "";
        var hasDecimal = false;
        
        for (var i = 0; i < val.length; i++) {
            var char = val[i];
            var charCode = value.charCodeAt(i);
            if (filter.isDecimalPoint().execute(charCode)) { // char == "."
                if (hasDecimal == false) {
                    hasDecimal = true;
                    filtered += char;
                }
            } else if ( filter.isNumber().execute(charCode)) {
                filtered += char;
            }
        }
        
        return filtered;
    },
    
    //  number is below certain value or removes digits from end of value 
    'LimitedTo': function (value, limit) {
        
        var v = value;
        var val = parseFloat(value);
        
        if (value != "") {
        
            while (val > limit) {
                v = v.substr(0,v.length-1);
                val = parseFloat(v);
            }
        
            return val.toString();
        }
        return value;
        
    },
    
    'empty': function (value) {
        
        var val = value.trim();
        
        return val.length == 0;
        
        
    }
}


var inputTextFilters = {
      'numberOnly':function (obj) {
           return filters.NumberOnly(obj.value);
       },
      'positiveOnly':function (obj) {
            return filters.PositiveDecimalOnly(obj.value);
        },
      
     'limitedTo':function (val,lim) {
            return filters.LimitedTo(val,lim);
        
        }
}
