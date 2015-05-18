(function () {

    "use strict";

    function Stack() {
        this.data = [];
    }

    Stack.prototype.push = function( value ) {
        this.data.push( value );
        return this;
    };

    Stack.prototype.pop = function() {
        this.data.pop();
        return this;
    };

    Stack.prototype.top = function() {
        var index = this.data.length - 1;
        if ( index < 0 ) {
            return null;
        }
        return this.data[ index ];
    };

    module.exports = Stack;

}());
