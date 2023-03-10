const path = require('path');
const confusingBrowserGlobals = require('confusing-browser-globals');
const tsconfigPath = path.resolve(__dirname, './tsconfig.esm.json');
const prettierPlugin = require('eslint-plugin-prettier');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended');
const typescriptRecommendedType = require('@typescript-eslint/eslint-plugin/dist/configs/recommended-requiring-type-checking');
const typescriptStrict = require('@typescript-eslint/eslint-plugin/dist/configs/strict');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = {
  plugins: {
    '@typescript-eslint': typescriptPlugin,
    'prettier': prettierPlugin,
  },
  files: ['**/*.{ts,tsx}'],
  ignores: ['node_modules', 'lib', 'src/playground.ts'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: typescriptParser,
    parserOptions: { project: tsconfigPath },
  },
  rules: {
    ...typescriptRecommended.rules,
    ...typescriptRecommendedType.rules,
    ...typescriptStrict.rules,
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/triple-slash-reference': [
      'error',
      { path: 'always', types: 'prefer-import', lib: 'always' },
    ],
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-explicit-any': 'off',

    // Custom rules
    'arrow-parens': ['warn', 'as-needed'],
    'complexity': ['error', 24],
    'id-blacklist': [
      'error',
      'any',
      'Number',
      //   'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    'max-len': [
      'error',
      { code: 100, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true },
    ],

    // Airbnb Typescript
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      { selector: 'function', format: ['camelCase', 'PascalCase'] },
      { selector: 'typeLike', format: ['PascalCase'] },
    ],
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        enums: 'always-multiline',
        generics: 'always-multiline',
        tuples: 'always-multiline',
      },
    ],
    '@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
    '@typescript-eslint/func-call-spacing': ['error', 'never'],
    // FIXME: Some typescript type unions use more indentation when there is multiple lines
    '@typescript-eslint/indent': [
      'off',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
      },
    ],
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: false },
    ],
    '@typescript-eslint/no-extra-parens': [
      'off',
      'all',
      {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        enforceForArrowConditionals: false,
      },
    ],
    '@typescript-eslint/no-loop-func': 'error',
    '@typescript-eslint/no-magic-numbers': [
      'off',
      {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
        ignoreDefaultValues: true,
      },
    ],
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unused-expressions': [
      'off',
      { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'off',
      { functions: true, classes: true, variables: true },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/space-infix-ops': ['error', { int32Hint: false }],
    '@typescript-eslint/object-curly-spacing': 'off',

    // Best Practices
    'array-callback-return': ['error', { allowImplicit: true }],
    'block-scoped-var': 'error',
    'class-methods-use-this': ['error', { exceptMethods: [] }],
    'consistent-return': 'error',
    'curly': ['error', 'multi-line'], // multiline
    'default-case': ['error', { commentPattern: '^no default$' }],
    'default-case-last': 'error',
    'default-param-last': 'error',
    'dot-location': ['error', 'property'],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'max-classes-per-file': ['error', 1],
    'no-alert': 'warn',
    'no-caller': 'error',
    'no-constructor-return': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-native-reassign': 'error',
    'no-implicit-coercion': ['error', { boolean: true, number: true, string: true, allow: [] }],
    'no-implicit-globals': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 'error',
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'accumulator', // for reduce accumulators
          'e', // for e.return value
          'ctx', // for Koa routing
          'context', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          '$scope', // for Angular 1 scopes
          'staticContext', // for ReactRouter context
        ],
      },
    ],
    'no-proto': 'error',
    'no-restricted-properties': [
      'error',
      { object: 'arguments', property: 'callee', message: 'arguments.callee is deprecated' },
      { object: 'global', property: 'isFinite', message: 'Please use Number.isFinite instead' },
      { object: 'self', property: 'isFinite', message: 'Please use Number.isFinite instead' },
      { object: 'window', property: 'isFinite', message: 'Please use Number.isFinite instead' },
      { object: 'global', property: 'isNaN', message: 'Please use Number.isNaN instead' },
      { object: 'self', property: 'isNaN', message: 'Please use Number.isNaN instead' },
      { object: 'window', property: 'isNaN', message: 'Please use Number.isNaN instead' },
      { property: '__defineGetter__', message: 'Please use Object.defineProperty instead.' },
      { property: '__defineSetter__', message: 'Please use Object.defineProperty instead.' },
      { object: 'Math', property: 'pow', message: 'Use the exponentiation operator (**) instead.' },
    ],
    'no-return-assign': ['error', 'always'],
    'no-script-url': 'error',
    'no-self-assign': ['error', { props: true }],
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-unused-labels': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
    'prefer-regex-literals': 'error',
    'radix': 'error',
    'vars-on-top': 'error',
    'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],
    'yoda': 'error',

    // Errors
    'no-await-in-loop': 'error',
    'no-cond-assign': ['error', 'always'],
    'no-console': 'warn',
    'no-constant-condition': 'warn',
    'no-promise-executor-return': 'error',
    'no-template-curly-in-string': 'error',
    'no-unreachable-loop': 'error',
    'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
    'no-negated-in-lhs': 'error',

    // ES6
    'arrow-spacing': ['error', { before: true, after: true }],
    'generator-star-spacing': ['error', { before: false, after: true }],
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: [
          'default', // use `export default` to provide a default export
          'then', // this will cause tons of confusion when your module is dynamically `import()`ed
        ],
      },
    ],
    'no-useless-computed-key': 'error',
    'no-useless-rename': [
      'error',
      { ignoreDestructuring: false, ignoreImport: false, ignoreExport: false },
    ],
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: { array: false, object: true },
        AssignmentExpression: { array: true, object: false },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prefer-numeric-literals': 'error',
    'prefer-template': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'yield-star-spacing': ['error', 'after'],

    // Style
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'capitalized-comments': [
      'error',
      'never',
      {
        line: { ignorePattern: '.*', ignoreInlineComments: true, ignoreConsecutiveComments: true },
        block: { ignorePattern: '.*', ignoreInlineComments: true, ignoreConsecutiveComments: true },
      },
    ],
    'comma-style': [
      'error',
      'last',
      {
        exceptions: {
          ArrayExpression: false,
          ArrayPattern: false,
          ArrowFunctionExpression: false,
          CallExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          ImportDeclaration: false,
          ObjectExpression: false,
          ObjectPattern: false,
          VariableDeclaration: false,
          NewExpression: false,
        },
      },
    ],
    'computed-property-spacing': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'function-call-argument-newline': ['error', 'consistent'],
    'func-names': 'warn',
    'func-style': ['error', 'expression'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'linebreak-style': ['error', 'unix'],
    'lines-around-directive': ['error', { before: 'always', after: 'always' }],
    'max-depth': ['warn', 12],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'max-params': ['warn', 4],
    'max-statements': ['warn', 30],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      },
    ],
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-continue': 'error',
    'no-lonely-if': 'error',
    'no-mixed-operators': [
      'error',
      {
        // the list of arithmetic groups disallows mixing `%` and `**`
        // with other arithmetic operators.
        groups: [
          ['%', '**'],
          ['%', '+'],
          ['%', '-'],
          ['%', '*'],
          ['%', '/'],
          ['/', '*'],
          ['&', '|', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!=='],
          ['&&', '||'],
        ],
        allowSamePrecedence: false,
      },
    ],
    'no-multi-assign': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'no-nested-ternary': 'off',
    'no-new-object': 'error',
    'no-plusplus': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-spaced-func': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': ['error', 'beside', { overrides: {} }],
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': ['error', 'always'],
    'operator-assignment': ['error', 'always'],
    'padded-blocks': [
      'error',
      { blocks: 'never', classes: 'never', switches: 'never' },
      { allowSingleLineBlocks: true },
    ],
    'prefer-exponentiation-operator': 'error',
    'prefer-object-spread': 'error',
    'quote-props': [
      'error',
      'consistent-as-needed',
      { keywords: false, unnecessary: true, numbers: false },
    ],
    'semi-spacing': ['error', { before: false, after: true }],
    'semi-style': ['error', 'last'],
    'sort-vars': 'off',
    'space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],
    'space-unary-ops': ['error', { words: true, nonwords: false, overrides: {} }],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!', '/'], // space here to support sprockets directives, slash for TS /// comments
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
          balanced: true,
        },
      },
    ],
    'switch-colon-spacing': ['error', { after: true, before: false }],
    'template-tag-spacing': ['error', 'never'],
    'unicode-bom': ['error', 'never'],

    // Variables
    'no-catch-shadow': 'error',
    'no-label-var': 'error',
    'no-restricted-globals': [
      'error',
      {
        name: 'isFinite',
        message:
          'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
      },
      {
        name: 'isNaN',
        message:
          'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
      },
    ].concat(confusingBrowserGlobals),
    'no-undef-init': 'error',

    // Disabled Rules
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'array-bracket-newline': ['off', 'consistent'],
    'array-element-newline': ['off', { multiline: true, minItems: 5 }],
    'consistent-this': 'off',
    'func-name-matching': 'off',
    'function-paren-newline': ['off', 'consistent'],
    'id-denylist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'implicit-arrow-linebreak': ['off', 'beside'],
    'init-declarations': 'off',
    'lines-around-comment': 'off',
    'line-comment-position': [
      'off',
      { position: 'above', ignorePattern: '', applyDefaultPatterns: true },
    ],
    // Set off because of page function components
    'max-lines-per-function': [
      'off',
      { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
    ],
    'max-nested-callbacks': 'off',
    'max-statements-per-line': ['off', { max: 1 }],
    'multiline-comment-style': ['off', 'starred-block'],
    'multiline-ternary': ['off', 'never'],
    // Our usage doesn't make it confusing
    'no-confusing-arrow': ['off', { allowParens: true }],
    // Disabled because there is a equal rule in the import plugin
    'no-duplicate-imports': 'off',
    'no-eq-null': 'off',
    'no-inline-comments': 'off',
    'no-negated-condition': 'off',
    'no-restricted-imports': 'off',
    'no-ternary': 'off',
    'no-undefined': 'off',
    'object-curly-newline': 'off',
    'object-property-newline': 'off',
    'operator-linebreak': ['off', 'before', { overrides: { '=': 'none' } }],
    'padding-line-between-statements': 'off',
    'prefer-reflect': 'off',
    'require-atomic-updates': 'off',
    'require-unicode-regexp': 'off',
    'sort-imports': 'off',
    'wrap-regex': 'off',

    // Typescript eslint disable
    'brace-style': 'off',
    'camelcase': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'dot-notation': 'off',
    'func-call-spacing': 'off',
    'indent': 'off',
    'keyword-spacing': 'off',
    'lines-between-class-members': 'off',
    'no-extra-parens': 'off',
    'no-new-func': 'off',
    'no-loop-func': 'off',
    'no-magic-numbers': 'off',
    'no-shadow': 'off',
    'no-throw-literal': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'quotes': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    'no-return-await': 'off',
    'space-infix-ops': 'off',
    'object-curly-spacing': 'off',
  },
};
