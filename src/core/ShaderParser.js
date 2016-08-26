(function () {

    'use strict';

    let PRECISION_QUALIFIERS = {
        highp: true,
        mediump: true,
        lowp: true
    };

    let PRECISION_TYPES = {
        float: 'float',
        vec2: 'float',
        vec3: 'float',
        vec4: 'float',
        ivec2: 'int',
        ivec3: 'int',
        ivec4: 'int',
        int: 'int',
        uint: 'int',
        sampler2D: 'sampler2D',
        samplerCube: 'samplerCube',
    };

    let COMMENTS_REGEXP = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm;
    let ENDLINE_REGEXP = /(\r\n|\n|\r)/gm;
    let WHITESPACE_REGEXP = /\s{2,}/g;
    let BRACKET_WHITESPACE_REGEXP = /(\s*)(\[)(\s*)(\d+)(\s*)(\])(\s*)/g;
    let NAME_COUNT_REGEXP = /([a-zA-Z_][a-zA-Z0-9_]*)(?:\[(\d+)\])?/;
    let PRECISION_REGEX = /\b(precision)\s+(\w+)\s+(\w+)/;
    let GLSL_REGEXP =  /void\s+main\s*\(\s*(void)*\s*\)\s*/mi;
    let PREP_REGEXP = /#(define|if|ifdef|ifndef|else|elif|endif|undef|error|pragma|extension|version|line).*\n/g;

    /**
     * Removes standard comments from the provided string.
     * @private
     *
     * @param {String} str - The string to strip comments from.
     *
     * @returns {String} - The commentless string.
     */
    function stripComments( str ) {
        // regex source: https://github.com/moagrius/stripcomments
        return str.replace( COMMENTS_REGEXP, '' );
    }

    /**
     * Converts all whitespace into a single ' ' space character.
     * @private
     *
     * @param {String} str - The string to normalize whitespace from.
     *
     * @returns {String} - The normalized string.
     */
    function normalizeWhitespace( str ) {
        return str.replace( ENDLINE_REGEXP, ' ' ) // remove line endings
            .replace( WHITESPACE_REGEXP, ' ' ) // normalize whitespace to single ' '
            .replace( BRACKET_WHITESPACE_REGEXP, '$2$4$6' ); // remove whitespace in brackets
    }

    /**
     * Parses the name and count out of a name statement, returning the
     * declaration object.
     * @private
     *
     * @param {String} qualifier - The qualifier string.
     * @param {String} precision - The precision string.
     * @param {String} type - The type string.
     * @param {String} entry - The letiable declaration string.
     *
     * @returns {Object} - The declaration object.
     */
    function parseNameAndCount( qualifier, precision, type, entry ) {
        // determine name and size of letiable
        let matches = entry.match( NAME_COUNT_REGEXP );
        let name = matches[1];
        let count = ( matches[2] === undefined ) ? 1 : parseInt( matches[2], 10 );
        return {
            qualifier: qualifier,
            precision: precision,
            type: type,
            name: name,
            count: count
        };
    }

    /**
     * Parses a single 'statement'. A 'statement' is considered any sequence of
     * characters followed by a semi-colon. Therefore, a single 'statement' in
     * this sense could contain several comma separated declarations. Returns
     * all resulting declarations.
     * @private
     *
     * @param {String} statement - The statement to parse.
     * @param {Object} precisions - The current state of global precisions.
     *
     * @returns {Array} - The array of parsed declaration objects.
     */
    function parseStatement( statement, precisions ) {
        // split statement on commas
        //
        // [ 'uniform highp mat4 A[10]', 'B', 'C[2]' ]
        //
        let commaSplit = statement.split(',').map( elem => {
            return elem.trim();
        });

        // split declaration header from statement
        //
        // [ 'uniform', 'highp', 'mat4', 'A[10]' ]
        //
        let header = commaSplit.shift().split(' ');

        // qualifier is always first element
        //
        // 'uniform'
        //
        let qualifier = header.shift();

        // precision may or may not be declared
        //
        // 'highp' || (if it was omited) 'mat4'
        //
        let precision = header.shift();
        let type;
        // if not a precision keyword it is the type instead
        if ( !PRECISION_QUALIFIERS[ precision ] ) {
            type = precision;
            precision = precisions[ PRECISION_TYPES[ type ] ];
        } else {
            type = header.shift();
        }

        // last part of header will be the first, and possible only letiable name
        //
        // [ 'A[10]', 'B', 'C[2]' ]
        //
        let names = header.concat( commaSplit );
        // if there are other names after a ',' add them as well
        let results = [];
        names.forEach( name => {
            results.push( parseNameAndCount( qualifier, precision, type, name ) );
        });
        return results;
    }

    /**
     * Splits the source string by semi-colons and constructs an array of
     * declaration objects based on the provided qualifier keywords.
     * @private
     *
     * @param {String} source - The shader source string.
     * @param {String|Array} keywords - The qualifier declaration keywords.
     *
     * @returns {Array} - The array of qualifier declaration objects.
     */
    function parseSource( source, keywords ) {
        // remove all comments from source
        let commentlessSource = stripComments( source );
        // normalize all whitespace in the source
        let normalized = normalizeWhitespace( commentlessSource );
        // get individual statements ( any sequence ending in ; )
        let statements = normalized.split(';');
        // build regex for parsing statements with targetted keywords
        let keywordStr = keywords.join('|');
        let keywordRegex = new RegExp( '\\b(' + keywordStr + ')\\b.*' );
        // parse and store global precision statements and any declarations
        let precisions = {};
        let matched = [];
        // for each statement
        statements.forEach( statement => {
            // check if precision statement
            //
            // [ 'precision highp float', 'precision', 'highp', 'float' ]
            //
            let pmatch = statement.match( PRECISION_REGEX );
            if ( pmatch ) {
                precisions[ pmatch[3] ] = pmatch[2];
                return;
            }
            // check for keywords
            //
            // [ 'uniform float time' ]
            //
            let kmatch = statement.match( keywordRegex );
            if ( kmatch ) {
                // parse statement and add to array
                matched = matched.concat( parseStatement( kmatch[0], precisions ) );
            }
        });
        return matched;
    }

    /**
     * Filters out duplicate declarations present between shaders. Currently
     * just removes all # statements.
     * @private
     *
     * @param {Array} declarations - The array of declarations.
     *
     * @returns {Array} - The filtered array of declarations.
     */
    function filterDuplicatesByName( declarations ) {
        // in cases where the same declarations are present in multiple
        // sources, this function will remove duplicates from the results
        let seen = {};
        return declarations.filter( declaration => {
            if ( seen[ declaration.name ] ) {
                return false;
            }
            seen[ declaration.name ] = true;
            return true;
        });
    }

    /**
     * Runs the preprocessor on the glsl code.
     * @private
     *
     * @param {String} source - The unprocessed source code.
     *
     * @returns {String} - The processed source code.
     */
    function preprocess( source ) {
        // TODO: implement this correctly...
        return source.replace(PREP_REGEXP, '');
    }

    module.exports = {

        /**
         * Parses the provided GLSL source, and returns all declaration statements that contain the provided qualifier type. This can be used to extract all attributes and uniform names and types from a shader.
         *
         * For example, when provided a 'uniform' qualifiers, the declaration:
         *
         *     'uniform highp vec3 uSpecularColor;'
         *
         * Would be parsed to:
         *     {
         *         qualifier: 'uniform',
         *         type: 'vec3',
         *         name: 'uSpecularColor',
         *         count: 1
         *     }
         * @param {Array} sources - The shader sources.
         * @param {Array} qualifiers - The qualifiers to extract.
         *
         * @returns {Array} - The array of qualifier declaration statements.
         */
        parseDeclarations: function( sources = [], qualifiers = [] ) {
            // if no sources or qualifiers are provided, return empty array
            if ( !Array.isArray(qualifiers) || qualifiers.length === 0 ||
                !Array.isArray(sources) || sources.length === 0 ) {
                return [];
            }
            // parse out targetted declarations
            let declarations = [];
            sources.forEach( source => {
                let preprocessed = preprocess( source );
                declarations = declarations.concat( parseSource( preprocessed, qualifiers ) );
            });
            // remove duplicates and return
            return filterDuplicatesByName( declarations );
        },

        /**
         * Detects based on the existence of a 'void main() {' statement, if the string is glsl source code.
         *
         * @param {String} str - The input string to test.
         *
         * @returns {boolean} - True if the string is glsl code.
         */
        isGLSL: function( str ) {
            return GLSL_REGEXP.test( str );
        }

    };

}());
