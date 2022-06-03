"use strict";

const axios = require("axios");

class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({ Image: { Bytes: buffer } })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems.map(({ Name }) => Name).join(" and ");

    return { names, workingItems };
  }

  async translateImagelLabels(text) {
    const { TranslatedText } = await this.translatorSvc
      .translateText({
        SourceLanguageCode: "en",
        TargetLanguageCode: "pt",
        Text: text,
      })
      .promise();

    return TranslatedText.split(" e ");
  }

  async formatTextResults(texts, workingItems) {
    const finalTexts = [];

    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;
      finalTexts.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      );
    }

    return finalTexts.join("\n");
  }

  async getImageBuffer(imageUrl) {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data, "base64");
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters;

      console.info("Downloading image...");
      const buffer = await this.getImageBuffer(imageUrl);

      console.info("Detecting labels...");
      const { names, workingItems } = await this.detectImageLabels(buffer);

      console.info("Transforming to Portuguse...");
      const texts = await this.translateImagelLabels(names);

      console.info("Handling final object...");
      const finishText = await this.formatTextResults(texts, workingItems);

      return {
        statusCode: 200,
        body: `A imagem tem \n `.concat(finishText),
      };
    } catch (error) {
      console.error("**Error**", error.stack);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
  }
}

// FACTORY

const aws = require("aws-sdk");

const translator = new aws.Translate();
const rekognition = new aws.Rekognition();

const handler = new Handler({
  rekoSvc: rekognition,
  translatorSvc: translator,
});

module.exports.main = handler.main.bind(handler);
