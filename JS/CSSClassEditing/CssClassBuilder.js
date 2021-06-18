
    var CssClassBuilder = function () {
        var styleSheet;
        var pub = {};


        var constructor = function (modules) {
            if (!styleSheetsExist() || !headElementExists())
                return;

                getStyleSheet(modules);
                if (!styleSheetDefined()) {
                    makeStyleSheet(modules);
                }
        }
        
        var MediaType = function (styleSheet,media) {
            var styleSheet = styleSheet;
            var media = media;
            var prot = {};

            this.getMediaType = function () {
                return media;
            }
            this.getStyleSheet = function () {
                return styleSheet;
            }

            prot.addRuleWithVariablePrefix = function (styleSheetPrefix, selector, style) {
                var styleSheetLength = prot.getStyleSheetLength(styleSheetPrefix);
                for (var i = 0, l = styleSheetLength; i < l; i++) {
                    if(styleSheetPrefix[i].selectorText && styleSheetPrefix[i].selectorText.toLowerCase()==selector.toLowerCase()) {
                      styleSheetPrefix[i].style.cssText = style;
                      return;
                    }
                }
            }

            prot.removeRuleWithVariablePrefix = function (styleSheetPrefix,selector, removeSelectorFunc) {
                for (var i=0; i<styleSheetPrefix.length; i++) {
                    if (styleSheetPrefix[i].selectorText.toLowerCase() === selector.toLowerCase()) {        
                        removeSelectorFunc(i);
                    }
                }  
            }

            prot.getStyleSheetLength = function (styleSheetPrefix) {
                return (styleSheetPrefix) ? styleSheetPrefix.length : 0;
            }
            return prot;
        }

        MediaType.isMediaType = function (styleSheet,goalMediaType,mediaPrefix) {
            var mediaType = typeof styleSheet.media;
            if (mediaType==goalMediaType) {
                if (mediaPrefix === '' || (mediaPrefix.indexOf('screen') !== -1)) {
                    return true;
                }
            }
            return false;
        }

        var StringMediaType = function (styleSheet) {
            var pub = {};
            var prot = MediaType.call(pub,styleSheet,"string");

            pub.addRule = function (selector, style) {
                prot.addRuleWithVariablePrefix(styleSheet.rules,selector,style);
                styleSheet.addRule(selector,style);
            }

            pub.removeRule = function (selector) {
                prot.removeRuleWithVariablePrefix(styleSheet.rules,selector,styleSheet.removeRule);
            }

            return pub;
        }

        StringMediaType.isThisMediaType = function (styleSheet) {
            return MediaType.isMediaType(styleSheet,"string",styleSheet.media);
        }

        StringMediaType.getInstance = function (styleSheet) {
            return StringMediaType(styleSheet);
        }

        var ObjectMediaType = function (styleSheet) {
            var pub = {};
            var prot = MediaType.call(pub,styleSheet,"object");
            var pub = {};

            pub.addRule = function (selector, style) {
                var styleSheetLength = prot.getStyleSheetLength();
                prot.addRuleWithVariablePrefix(styleSheet.cssRules,selector,style);
                styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
            }

            pub.removeRule = function (selector) {
                prot.removeRuleWithVariablePrefix(styleSheet.cssRules,selector,styleSheet.deleteRule);
  
            }
            return pub;
        }

        ObjectMediaType.isThisMediaType = function (styleSheet) {
            return MediaType.isMediaType(styleSheet,"object",styleSheet.media.mediaText);
        }

        ObjectMediaType.getInstance = function (styleSheet) {
            return ObjectMediaType(styleSheet);
        }

        var makeMediaType = function (styleSheet,modules) {
            for (var module in modules) {
                if (modules[module].isThisMediaType(styleSheet)){
                    return modules[module].getInstance(styleSheet);
                }
            }
            return undefined;
        }

        var styleSheetsExist = function () {
            return document.styleSheets;
        }
        var headElementExists = function () {
            return document.getElementsByTagName('head').length !== 0;
        }

        var makeStyleElement = function () {
            var styleSheetElement = document.createElement('style');
            styleSheetElement.type = 'text/css';
            return styleSheetElement;
        }
        var makeStyleSheet = function (modules) {
            var styleSheetElement = makeStyleElement();
            document.getElementsByTagName('head')[0].appendChild(styleSheetElement);
        
            for (i = 0; i < document.styleSheets.length; i++) {
              if (!document.styleSheets[i].disabled) {
                styleSheet = makeMediaType(document.styleSheets[i],modules);
              }
            }
            
        }
        var getStyleSheet = function (modules) {
            if (document.styleSheets.length > 0) {
                for (var i = 0, l = document.styleSheets.length; i < l; i++) {
                    if (!document.styleSheets[i].disabled){
                        styleSheet = makeMediaType(document.styleSheets[i],modules);
                        if (styleSheetDefined()) 
                            break;
                    }
                }
            }
        }
        var styleSheetDefined = function () {
            return typeof styleSheet !== undefined;
        }

        pub.addRule = function(selector,style) {
            if (styleSheetDefined())
                styleSheet.addRule(selector,style);
        }

        pub.removeRule = function(selector) {
            if (styleSheetDefined())
                styleSheet.removeRule(selector);
        }

        var modules =  [StringMediaType,ObjectMediaType];
        constructor(modules);
        return pub;
    }
