"use strict";

const Joi = require("joi");
const Axios = require("axios");

const { promisify } = require("util");
const { exec } = require("child_process");
const { writeFile } = require("fs/promises");

const globalEnum = require("./util/globalEnum");
const decoratorValidator = require("./util/decoratorValidator");

const shell = promisify(exec);

class Handler {
  constructor() {}

  static validator() {
    return Joi.object().keys({
      image: Joi.string().uri().required(),
      topText: Joi.string().max(200).required(),
      bottomText: Joi.string().max(200).optional(),
    });
  }

  static generateImagePath() {
    return `/tmp/${new Date().getTime()}-out.png`;
  }

  static async saveImageLocally(imageUrl, imagePath) {
    const { data } = await Axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");
    return writeFile(imagePath, buffer);
  }

  static generateIdentifyCommand(imagePath) {
    const value = `
    gm identify \
    -verbose \
    ${imagePath}
    `;
    const cmd = value.split("\n").join(" ");
    return cmd;
  }

  static async getImageSize(imagePath) {
    const command = Handler.generateIdentifyCommand(imagePath);
    const { stdout } = await shell(command);
    const [line] = stdout
      .trim()
      .split("\n")
      .filter((text) => ~text.indexOf("Geometry"));
    const [width, height] = line.trim().replace("Geometry: ", "").split("x");

    return {
      width: Number(width),
      height: Number(height),
    };
  }

  static setParameters(options, dimensions, imagePath) {
    return {
      topText: options.topText,
      bottomText: options.bottomText || "",
      font: __dirname + "./resources/impact.ttf",
      fontSize: dimensions.width / 8,
      fontFill: "#FFF",
      textPos: "center",
      strokeColor: "#000",
      strokeWeight: 1,
      padding: 40,
      imagePath,
    };
  }

  static setTextPosition(dimensions, padding) {
    const top = Math.abs(dimensions.height / 2.1 - padding) * -1;
    const bottom = dimensions.height / 2.1 - padding;
    return {
      top,
      bottom,
    };
  }

  static async generateConvertCommand(options, finalPath) {
    const value = `
      gm convert
      '${options.imagePath}'
      -font '${options.font}'
      -pointsize ${options.fontSize}
      -fill '${options.fontFill}'
      -stroke '${options.strokeColor}'
      -strokewidth ${options.strokeWeight}
      -draw 'gravity ${options.textPos} text 0,${options.top}  "${options.topText}"'
      -draw 'gravity ${options.textPos} text 0,${options.bottom}  "${options.bottomText}"'
      ${finalPath}
    `;
    const final = value.split("\n").join(" ");
    const { stdout } = await shell(final);
    return stdout;
  }

  static async generateBase64(imagePath) {
    return readFile(imagePath, "base64");
  }

  static async main(event) {
    try {
      const options = event.queryStringParamerters;

      console.log("Downloading image...");
      const imagePath = Handler.generateImagePath();
      await Handler.saveImageLocally(options.image, imagePath);

      console.log("Getting image size...");
      const dimensions = await Handler.getImageSize(imagePath);
      const params = Handler.setParameters(options, dimensions, imagePath);
      const { top, bottom } = Handler.setTextPosition(
        dimensions,
        params.padding
      );
      const finalPath = Handler.generateImagePath();

      console.log("generating meme image...");
      await Handler.generateConvertCommand(
        {
          ...params,
          top,
          bottom,
        },
        finalPath
      );

      console.log("generating base64...");
      const imageBuffer = await Handler.generateBase64(finalPath);

      console.log("finishing...");
      await Promise.all([unlink(imagePath), unlink(finalPath)]);

      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html",
        },
        body: `<img src="data:image/jpeg;base64,${imageBuffer}"></img>`,
      };

      return response;
    } catch (error) {
      console.error("**ERROR**", error.stack);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

module.exports = {
  mememaker: decoratorValidator(
    Handler.main,
    Handler.validator(),
    globalEnum.ARG_TYPE.QUERYSTRING
  ),
};
