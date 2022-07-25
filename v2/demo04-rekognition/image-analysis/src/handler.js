const { get } = require('axios')
module.exports = class Handler {
  constructor({
    rekoSvc,
    translatorSvc
  }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: 'arraybuffer'
    })

    return Buffer.from(response.data, 'base64')
  }

  async detectedImageLabels(buffer) {
    const { Labels } = await this.rekoSvc
      .detectLabels({ Image: { Bytes: buffer } })
      .promise();

    const workingItems = Labels
      .filter(({ Confidence }) => Confidence > 80);

    const names = workingItems
      .map(({ Name }) => Name)
      .join(' and ');

    return { names, workingItems }
  }

  async translateText(text) {
    const { TranslatedText } = await this.translatorSvc
      .translateText({
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'pt',
        Text: text
      })
      .promise();

    return TranslatedText.split(' e ');
  }

  formatTextRestult(texts, workingItems) {
    const finalText = [];

    for (const index in texts) {
      const nameInPortuguese = texts[index];
      const confidence = workingItems[index].Confidence;
      finalText.push(`${nameInPortuguese} (${confidence.toFixed(2)}%)`);
    }

    return finalText.join('\n');
  }

  async main(event) {

    try {
      const { imageUrl } = event.queryStringParameters;

      if (!imageUrl) return {
        statusCode: 400,
        body: 'An image is required!'
      }

      console.log('Downloading image from', imageUrl);
      const buffer = await this.getImageBuffer(imageUrl);

      console.log('Detecting labels in image');
      const { names, workingItems } = await this.detectedImageLabels(buffer);

      console.log('Translating labels to Portuguese');
      const texts = await this.translateText(names);
      const finalText = this.formatTextRestult(texts, workingItems);

      return {
        statusCode: 200,
        body: "A imagem tem\n".concat(finalText)
      }

    } catch (error) {
      return {
        statusCode: 500,
        body: 'Internal Server Error!'
      }
    }
  }
}