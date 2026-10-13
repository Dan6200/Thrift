import chai from 'chai'
import { handleSortQuery } from '#src/context/catalog/infra/sort.js'

chai.should()

export default () => {
  describe('catalog infra sort (handleSortQuery)', () => {
    it('builds a single ascending column', () => {
      handleSortQuery('title').should.equal('ORDER BY title ASC')
    })

    it('builds a single descending column with a - prefix', () => {
      handleSortQuery('-base_price').should.equal('ORDER BY base_price DESC')
    })

    it('builds multiple columns with mixed direction', () => {
      handleSortQuery('-base_price,product_id').should.equal(
        'ORDER BY base_price DESC, product_id ASC',
      )
    })

    it('builds multiple ascending columns', () => {
      handleSortQuery('product_id,base_price').should.equal(
        'ORDER BY product_id ASC, base_price ASC',
      )
    })

    it('trims whitespace around columns', () => {
      handleSortQuery(' title , -base_price ').should.equal(
        'ORDER BY title ASC, base_price DESC',
      )
    })

    it('ignores columns that are not allowed', () => {
      handleSortQuery('title,hacked; DROP TABLE').should.equal(
        'ORDER BY title ASC',
      )
    })

    it('returns an empty string when no column is valid', () => {
      handleSortQuery('bogus_column').should.equal('')
    })

    it('returns an empty string for an empty input', () => {
      handleSortQuery('').should.equal('')
    })

    it('supports the documented sortable columns', () => {
      for (const column of [
        'product_id',
        'title',
        'base_price',
        'created_at',
        'updated_at',
        'average_rating',
        'review_count',
        'products_sold',
      ]) {
        handleSortQuery(column).should.equal(`ORDER BY ${column} ASC`)
      }
    })
  })
}
