(function () {

    "use strict";

    var PRECISION_QUALIFIERS = {
        highp: true,
        mediump: true,
        lowp: true
    };

    /**
     * Removes standard comments from the provided string.
     *
     * @param {String} str - The string to strip comments from.
     *
     * @return {String} The commentless string.
     */
    function stripComments( str ) {
        // regex source: https://github.com/moagrius/stripcomments
        return str.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
    }

    /**
     * Converts all whitespace into a single ' ' space character.
     *
     * @param {String} str - The string to normalize whitespace from.
     *
     * @return {String} The normalized string.
     */
    function normalizeWhitespace( str ) {
        // remove all end lines, replace all whitespace with a single ' ' space
        return str.replace(/(\r\n|\n|\r)/gm,"").replace(/\s{2,}/g, ' ');
    }

    /**
     * Parses a single 'statement'. A 'statement' is considered any sequence of
     * characters followed by a semi-colon. Therefore, a single 'statement' in
     * this sense could contain several comma separated declarations. Returns
     * all resulting declarations.
     *
     * @param {String} statement - The statement to parse.
     *
     * @returns {Array} The array of parsed declaration objects.
     */
    function parseStatement( statement ) {

        function parseNameAndCount( entry ) {
            // split on '[]' and trim whitespce to check for arrays
            var split = entry.split(/[\[\]]/).map( function( elem ) {
                return elem.trim();
            });
            return {
                qualifier: qualifier,
                precision: precision,
                type: type,
                name: split[0],
                count: ( split[1] === undefined ) ? 1 : parseInt( split[1], 10 )
            };
        }

        var results = [],
            commaSplit,
            header,
            qualifier,
            precision,
            type,
            names,
            i;
        // split statement on commas
        commaSplit = statement.split(',').map( function( elem ) {
            return elem.trim();
        });
        // split declaration header from statement
        header = commaSplit.shift().split(' ');
        // qualifier is always first element
        qualifier = header.shift();
        // precision may or may not be declared
        precision = header.shift();
        // if not a precision keyword it is the type instead
        if ( !PRECISION_QUALIFIERS[ precision ] ) {
            type = precision;
            precision = null;
        } else {
            type = header.shift();
        }
        // split remaining names by commas and trim whitespace
        names = header.concat( commaSplit );
        // if there are other names after a ',' add them as well
        for ( i=0; i<names.length; i++ ) {
            results.push( parseNameAndCount( names[i] ) );
        }
        return results;
    }

    /**
     * Splits the source string by semi-colons and constructs an array of
     * declaration objects based on the provided qualifier keywords.
     *
     * @param {String} source - The shader source string.
     * @param {String|Array} keyword - The qualifier declaration keyword.
     *
     * @returns {Array} The array of qualifier declaration objects.
     */
    function parseSource( source, keyword ) {
        // get statements ( any sequence ending in ; ) containing any
        // of the given keywords
        var keywordStr = ( keyword instanceof Array ) ? keyword.join('|') : keyword,
            keywordRegex = new RegExp( "^.*\\b("+keywordStr+")\\b.*", 'gm' ),
            commentlessSource = stripComments( source ),
            normalized = normalizeWhitespace( commentlessSource ),
            statements = normalized.split(';'),
            matched = [],
            match, i;
        // for each statement
        for ( i=0; i<statements.length; i++ ) {
            // look for keywords
            match = statements[i].trim().match( keywordRegex );
            if ( match ) {
                // parse statement and add to array
                matched = matched.concat( parseStatement( match[0] ) );
            }
        }
        return matched;
    }

    /**
     * Filters out duplicate declarations present between shaders.
     *
     * @params {Array} declarations - The array of declarations.
     *
     * @returns {Array} The filtered array of declarations.
     */
    function filterDuplicatesByName( declarations ) {
        // in cases where the same declarations are present in multiple
        // sources, this function will remove duplicates from the results
        var seen = {};
        return declarations.filter( function( declaration ) {
            return seen.hasOwnProperty( declaration.name ) ? false : ( seen[ declaration.name ] = true );
        });
    }

    module.exports = {

        /**
         * Parses the provided GLSL source, and returns all declaration statements
         * that contain the provided qualifier type. This can be used to extract
         * all attributes and uniform names and types from a shader.
         *
         * Ex.
         *
         *     When provided a "uniform" qualifiers, the declaration:
         *
         *         "uniform highp vec3 uSpecularColor;"
         *
         *     Would be parsed to:
         *
         *         {
         *             qualifier: "uniform",
         *             type: "vec3",
         *             name: "uSpecularColor",
         *             count: 1
         *         }
         *
         * @param {String|Array} source - The shader sources.
         * @param {String|Array} qualifiers - The qualifiers to extract.
         *
         * @returns {Array} The array of qualifier declaration statements.
         */
        parseDeclarations: function( source, qualifiers ) {
            // if no qualifiers are provided, return empty array
            if ( !qualifiers || qualifiers.length === 0 ) {
                return [];
            }
            var sources = ( source instanceof Array ) ? source : [ source ],
                declarations = [],
                i;
            for ( i=0; i<sources.length; i++ ) {
                declarations = declarations.concat( parseSource( sources[i], qualifiers ) );
            }
            // remove duplicates and return
            return filterDuplicatesByName( declarations );
        },

        /**
         * Detects based on the existence of a 'void main() {' statement, if
         * the string is glsl source code.
         *
         * @param {String} str - The input string to test.
         *
         * @returns {boolean} - True if the string is glsl code.
         */
        isGLSL: function( str ) {
            return /void\s+main\s*\(\s*\)\s*/.test( str );
        }

    };

}());
