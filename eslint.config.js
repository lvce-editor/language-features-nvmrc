import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...actions.default,
  {
    files: ['packages/e2e/src/nvmrc.completion-*.ts'],
    rules: {
      'e2e/no-imports': 'off',
    },
  },
]
