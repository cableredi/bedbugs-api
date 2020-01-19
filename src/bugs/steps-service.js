const StepsService = {
  getAllSteps(knex, id) {
    return knex.from('steps').select('*').where('bug_id', id)
  },
  updateSteps(knex, id, newStepsFields) {
    return knex('steps')
      .where({ steps_id: id })
      .update(newStepsFields)
  },
  insertSteps(knex, newStep) {
    return knex
      .insert(newStep)
      .into('steps')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  }
};

module.exports = StepsService;