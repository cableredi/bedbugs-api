const BugsService = {
  getAllBugs(knex) {
    return knex.select('*').from('bugs')
  },
  getById(knex, id) {
    return knex.from('bugs').select('*').where('bug_id', id).first()
  },
  updateBug(knex, id, newBugsFields) {
    return knex('bugs')
      .where({ bugs_id: id })
      .update(newBugsFields)
  },
  insertBug(knex, newBug) {
    return knex
      .insert(newBug)
      .into('bugs')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  }
};

module.exports = BugsService;