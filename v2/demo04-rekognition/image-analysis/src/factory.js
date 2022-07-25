const AWS = require('aws-sdk')
const Handler = require('./handler')

const rekoSvc = new AWS.Rekognition()
const translatorSvc = new AWS.Translate()

const handler = new Handler({ rekoSvc, translatorSvc })

module.exports = handler.main.bind(handler)