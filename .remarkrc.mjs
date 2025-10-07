import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkFrontmatter from 'remark-frontmatter'
import remarkValidateLinks from 'remark-validate-links'

export default {
  plugins: [
    remarkFrontmatter,
    remarkPresetLintRecommended,
    remarkPresetLintConsistent,
    remarkValidateLinks,
  ],
}
