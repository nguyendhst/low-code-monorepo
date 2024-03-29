/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ["@repo/eslint-config/react-internal.js"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    ignorePatterns: ["tailwind.config.js", "postcss.config.js"],
    rules: {
        "unicorn/prevent-abbreviations": "off",
		"no-redeclare": 0,
    },
};
