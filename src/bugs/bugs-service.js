const BugsService = {
  getAllBugs(knex) {
    return knex
      .select('*')
      .from('bugs')
      .orderBy('bugs.bug_id', 'asc')
  },
  getById(knex, id) {
    return knex
      .select('*')
      .from('bugs')
      .where('bugs.bug_id', id)
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