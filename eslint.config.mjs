import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        rules: {
            // 사용하지 않는 변수 규칙 완화
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // React JSX 관련 규칙
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        plugins: ['jsx-a11y', '@typescript-eslint', 'prettier', 'jest'],

        env: {
            // 전역객체를 eslint가 인식하는 구간
            browser: true, // document나 window 인식되게 함
            node: true,
            es6: true,
            'jest/globals': true,
        },

        ignorePatterns: [
            'node_modules/',
            '.eslintrc.js',
            'next.config.js',
            'postcss.config.js',
            'run_server.js',
            'jest.config.ts',
        ], // eslint 미적용될 폴더나 파일 명시
    },
];
