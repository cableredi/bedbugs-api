const BugsService = {
  getAllBugs(knex, user_id) {
    return knex
      .select('*')
      .from('bugs')
      .where('users.user_id', user_id)
      .leftJoin('applications', 'applications.application_id', 'bugs.application_id')
      .leftJoin('users', 'users.user_id', 'applications.user_id')
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