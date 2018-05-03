const Sequelize = require('sequelize')
const db = require('../db')

const DicomInfo = db.define('dicomInfo', {
    imageURL: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    studyDesc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    patientId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    studyId:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = DicomInfo