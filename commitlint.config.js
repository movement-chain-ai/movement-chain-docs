module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'docs',     // Documentation changes
        'feat',     // New features
        'fix',      // Bug fixes
        'chore',    // Maintenance tasks
        'style',    // Formatting changes
        'refactor', // Code restructuring
        'test',     // Adding tests
        'ci',       // CI/CD changes
        'perf',     // Performance improvements
        'revert'    // Reverting changes
      ]
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100]
  }
};
