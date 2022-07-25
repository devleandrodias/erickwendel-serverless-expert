const aws = require('aws-sdk')

const { describe, test, expect } = require('@jest/globals')

const requestMock = require('./../mocks/request.json')

aws.config.update({ region: 'us-east-1' })

const { main } = require('./../../src')

describe('Image analyser test suite', () => {
  test('it should analyse successfully the image returning the correct result', async () => {
    const finalText = [
      'Cão (99.48%)',
      'canino (99.48%)',
      'animal de estimação (99.48%)',
      'animal (99.48%)',
      'cão mamífero (99.48%)',
      'esquimó (84.31%)'
    ].join("\n");

    const expected = { statusCode: 200, body: "A imagem tem\n".concat(finalText) }
    const result = await main(requestMock)
    expect(result).toStrictEqual(expected)
  })

  test('given an empty queryString it should return status code 400', async () => {
    const expected = { statusCode: 400, body: "An image is required!" }
    const result = await main({ queryStringParameters: "" })
    expect(result).toStrictEqual(expected)
  })

  test('given an invalid ImageURL it should return status code 500', async () => {
    const expected = { statusCode: 500, body: "Internal Server Error!" }
    const result = await main({
      queryStringParameters: {
        imageUrl: "https://invalid-url.com"
      }
    })
    expect(result).toStrictEqual(expected)
  })
})