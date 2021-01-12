module.exports = {
  extends: ['alloy', 'alloy/vue'],
  env: {
    // Your environments (which contains several predefined global variables)
    browser: true,
  },
  rules: {
    // Customize your rules
    "vue/component-tags-order": ["error", {
      "order": ["template", "script", "style"]
    }],
    "max-params": ["error", 7],
  },
}
