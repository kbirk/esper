(function () {

    'use strict';

    let COMMENTS_REGEXP = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm;
    let ENDLINE_REGEXP = /(\r\n|\n|\r)/gm;
    let WHITESPACE_REGEXP = /\s{2,}/g;
    let BRACKET_WHITESPACE_REGEXP = /(\s*)(\[)(\s*)(\d+)(\s*)(\])(\s*)/g;
    let NAME_COUNT_REGEXP = /([a-zA-Z_][a-zA-Z0-9_]*)(?:\[(\d+)\])?/;
    let PRECISION_REGEX = /\bprecision\s+\w+\s+\w+;/g;
    let INLINE_PRECISION_REGEX = /\b(highp|mediump|lowp)\s+/g;
    let GLSL_REGEXP = /void\s+main\s*\(\s*(void)*\s*\)\s*/mi;
    let PREP_REGEXP = /#([\W\w\s\d])(?:.*\\r?\n)*.*$/gm;

    /**
     * Removes standard comments from the provided string.
     * @private
     *
     * @param {String} str - The string to strip comments from.
     *
     * @return {String} The commentless string.
     */
    function stripComments(str) {
        // regex source: https://github.com/moagrius/stripcomments
        return str.replace(COMMENTS_REGEXP, '');
    }

    /**
     * Removes an precision statements.
     * @private
     *
     * @param {String} source - The unprocessed source code.
     *
     * @return {String} The processed source code.
     */
    function stripPrecision(source) {
        // remove global precision declarations
        source = source.replace(PRECISION_REGEX, '');
        // remove inline precision declarations
        return source.replace(INLINE_PRECISION_REGEX, '');
    }

    /**
     * Converts all whitespace into a single ' ' space character.
     * @private
     *
     * @param {String} str - The string to normalize whitespace from.
     *
     * @return {String} The normalized string.
     */
    function normalizeWhitespace(str) {
        return str.replace(ENDLINE_REGEXP, ' ') // remove line endings
            .replace(WHITESPACE_REGEXP, ' ') // normalize whitespace to single ' '
            .replace(BRACKET_WHITESPACE_REGEXP, '$2$4$6'); // remove whitespace in brackets
    }

    /**
     * Parses the name and count out of a name statement, returning the declaration object.
     * @private
     *
     * @param {String} qualifier - The qualifier string.
     * @param {String} type - The type string.
     * @param {String} entry - The variable declaration string.
     *
     * @return {Object} The declaration object.
     */
    function parseNameAndCount(qualifier, type, entry) {
        // determine name and size of variable
        let matches = entry.match(NAME_COUNT_REGEXP);
        let name = matches[1];
        let count = (matches[2] === undefined) ? 1 : parseInt(matches[2], 10);
        return {
            qualifier: qualifier,
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
     *
     * @return {Array} The array of parsed declaration objects.
     */
    function parseStatement(statement) {
        // split statement on commas
        //
        // ['uniform mat4 A[10]', 'B', 'C[2]']
        //
        let split = statement.split(',').map(elem => {
            return elem.trim();
        });

        // split declaration header from statement
        //
        // ['uniform', 'mat4', 'A[10]']
        //
        let header = split.shift().split(' ');

        // qualifier is always first element
        //
        // 'uniform'
        //
        let qualifier = header.shift();

        // type will be the second element
        //
        // 'mat4'
        //
        let type = header.shift();

        // last part of header will be the first, and possible only variable name
        //
        // ['A[10]', 'B', 'C[2]']
        //
        let names = header.concat(split);

        // if there are other names after a ',' add them as well
        return names.map(name => {
            return parseNameAndCount(qualifier, type, name);
        });
    }

    /**
     * Splits the source string by semi-colons and constructs an array of
     * declaration objects based on the provided qualifier keywords.
     * @private
     *
     * @param {String} source - The shader source string.
     * @param {String|Array} keywords - The qualifier declaration keywords.
     *
     * @return {Array} The array of qualifier declaration objects.
     */
    function parseSource(source, keywords) {
        // get individual statements (any sequence ending in ;)
        let statements = source.split(';');
        // build regex for parsing statements with targetted keywords
        let keywordStr = keywords.join('|');
        let keywordRegex = new RegExp('\\b(' + keywordStr + ')\\b.*');
        // parse and store global precision statements and any declarations
        let matched = [];
        // for each statement
        statements.forEach(statement => {
            // check for keywords
            //
            // ['uniform float uTime']
            //
            let kmatch = statement.match(keywordRegex);
            if (kmatch) {
                // parse statement and add to array
                matched = matched.concat(parseStatement(kmatch[0]));
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
     * @return {Array} The filtered array of declarations.
     */
    function filterDuplicatesByName(declarations) {
        // in cases where the same declarations are present in multiple
        // sources, this function will remove duplicates from the results
        let seen = {};
        return declarations.filter(declaration => {
            if (seen[declaration.name]) {
                return false;
            }
            seen[declaration.name] = true;
            return true;
        });
    }

    /**
     * Runs the preprocessor on the glsl code.
     * @private
     *
     * @param {String} source - The unprocessed source code.
     *
     * @return {String} The processed source code.
     */
    function preprocess(source) {
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
         * @return {Array} The array of qualifier declaration statements.
         */
        parseDeclarations: function(sources = [], qualifiers = []) {
            // if no sources or qualifiers are provided, return empty array
            if (sources.length === 0 || qualifiers.length === 0) {
                return [];
            }
            sources = Array.isArray(sources) ? sources : [sources];
            qualifiers = Array.isArray(qualifiers) ? qualifiers : [qualifiers];
            // parse out targetted declarations
            let declarations = [];
            sources.forEach(source => {
                // run preprocessor
                source = preprocess(source);
                // remove precision statements
                source = stripPrecision(source);
                // remove comments
                source = stripComments(source);
                // finally, normalize the whitespace
                source = normalizeWhitespace(source);
                // parse out declarations
                declarations = declarations.concat(parseSource(source, qualifiers));
            });
            // remove duplicates and return
            return filterDuplicatesByName(declarations);
        },

        /**
         * Detects based on the existence of a 'void main() {' statement, if the string is glsl source code.
         *
         * @param {String} str - The input string to test.
         *
         * @return {boolean} Whether or not the string is glsl code.
         */
        isGLSL: function(str) {
            return GLSL_REGEXP.test(str);
        }

    };

}());
