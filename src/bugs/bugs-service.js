const BugsService = {
  getAllBugs(knex) {
    return knex.select('*').from('bugs')
  },
  getById(knex, id) {
    return knex.from('bugs')
      .select('*')
      .from('bugs')
      .where('bug_id', id)
      .first()
  },
  updateBug(knex, id, updateBugFields) {
    return knex('bugs')
      .where({ bug_id: id })
      .update(updateBugFields)
  },
  insertBug(knex, newBug) {
    return knex
      .insert(newBug)
      .into('bugs')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteBug(knex, bug_id) {
    return knex('bugs')
      .where({ bug_id })
      .delete()
  }
};

module.exports = BugsService;