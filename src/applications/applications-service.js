const ApplicationsService = {
  getAllApplications(knex) {
    return knex.select('*').from('applications').orderBy('application_name', 'asc')
  },
  getById(knex, id) {
    return knex.from('applications').select('*').where('application_id', id).first()
  },
  updateApplication(knex, id, newApplicationFields) {
    return knex('applications')
      .where({ application_id: id })
      .update(newApplicationFields)
  },
  insertApplication(knex, newApplication) {
    return knex
      .insert(newApplication)
      .into('applications')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteApplication(knex, application_id) {
    return knex('applications')
      .where({ application_id })
      .delete()
  }
};

module.exports = ApplicationsService;