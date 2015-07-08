$.fn.mask = function(mask) {
        var el = this;
        var placeholder = [];
        var buffer = [];
        var pos = 0;
        var options = {
            translation: {
                '0': {pattern: /\d/},
                '*': {pattern: /[a-zA-Z0-9]/},
                'a': {pattern: /[a-zA-Z]/}
            },
            place: "_"
        }
        var init = function() {
            bindEvents();
        }
        var bindEvents = function() {
            el.on('click', function(){setPlaceholder();})
            .on('keydown', function(e) {e.preventDefault(); changeMask(e);});
        }
        var setCursor = function(input, pos) {
            var input = input[0];
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(pos, pos);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }
        var getCursor = function(input) {
            var input = input[0];
            if (input.selectionStart) { 
                return input.selectionStart; 
              } else if (document.selection) { 
                input.focus(); 
                var r = document.selection.createRange(); 
                if (r == null) { 
                  return 0; 
                } 
                var re = input.createTextRange(), 
                    rc = re.duplicate(); 
                re.moveToBookmark(r.getBookmark()); 
                rc.setEndPoint('EndToStart', re); 
                return rc.text.length; 
              }
              return 0; 
        }
        var setPlaceholder = function(){
            if (!el.val().length) {
                for(var i=0; i < mask.length; i++) {
                    var symbol = mask.charAt(i);
                    if(/^[0\*a]*$/.test(symbol)) {
                       pos = (pos == 0) ? i : pos;
                        placeholder.push(options.place);
                    } else {
                        placeholder.push(symbol);
                    }
                }
                el.val(placeholder.join(''));
                setCursor(el, pos);
            } else {
                return;
            }
        }
        var changeMask = function(e) {
            var newVal = Masking(e);
            el.val(newVal);
            setCursor(el, pos);
        }
        var getPlaceholder = function(i) {
            var placeholder_string = placeholder.join('');
            return placeholder_string.charAt(i);
        }
        var Masking = function(e) {
                    var k = e.which || e.keyCode || e.key;
                    var value = String.fromCharCode(k);
                    pos = getCursor(el);
                    buffer = (buffer.length == 0) ? placeholder.slice() : buffer;
                    
                    if (k == 8) {
                        
                        buffer[pos - 1] = getPlaceholder(pos - 1);
                        pos--;
                    } else if (k == 46) {
                        
                        buffer[pos] = getPlaceholder(pos);
                    } else {
                    
                    var maskDig = mask.charAt(pos),
                        translation = options.translation[maskDig];
                        
                        if(translation){
                            
                            if(value.match(translation.pattern)) {
                                buffer[pos] = value;
                                pos++; 
                            }

                        } else {
                            
                            buffer[pos] = maskDig;
                            
                        }
                        
                        var temp_pos = buffer.indexOf(options.place);
                        pos = temp_pos;
                    }
                        return buffer.join('');
                }
        init();
};