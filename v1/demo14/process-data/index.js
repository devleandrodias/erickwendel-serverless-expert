const AWS = require("aws-sdk");
const assert = require("assert");
const csvtojson = require("csvtojson");
const XLSXChart = require("xlsx-chart");

const { promisify } = require("util");
const { Transform, Writable, pipeline } = require("stream");

const {
  promises: { readFile },
} = require("fs");

const S3 = new AWS.S3();
const chart = new XLSXChart();

const pipelineAsync = promisify(pipeline);

const processDataStream = (salaryTypes, finalData) => {
  return new Writable({
    write: (chunk, _, cb) => {
      const item = JSON.parse(chunk);

      console.log("Respondent", item.Respondent);

      if (item.SalaryType === "NA") {
        return cb();
      }

      finalData.titles.push(item.SalaryType);
      finalData.fields.push(item.Country);

      if (!salaryTypes[item.SalaryType]) {
        salaryTypes[item.SalaryType] = {};
      }

      if (!salaryTypes[item.SalaryType][item.Country]) {
        salaryTypes[item.SalaryType][item.Country] = 1;

        return cb();
      }

      salaryTypes[item.SalaryType][item.Country] += 1;

      cb(null, item);
    },
  });
};

const mapStream = (elapsedBytes) => {
  return new Transform({
    objectMode: true,
    transform: (chunk, _, cb) => {
      elapsedBytes.count += chunk.length;

      const item = JSON.parse(chunk);
      const data = JSON.stringify({
        Country: item.Country,
        SalaryType: item.SalaryType,
        Respondent: item.Respondent,
      });

      cb(null, data);
    },
  });
};

const generateFile = async (finalData, salaryTypes) => {
  const id = require("uuid").v4();

  const opts = {
    file: `chart-${id}.xlsx`,
    chart: "column",
    titles: [...new Set(finalData.titles)].sort(),
    fields: [...new Set(finalData.fields)].sort(),
    data: salaryTypes,
  };

  const writeFileAsync = promisify(chart.writeFile.bind(chart));

  await writeFileAsync(opts);

  return { filename: opts.file };
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const unities = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, unities)).toFixed(dm)) +
    " " +
    sizes[unities]
  );
};

async function main() {
  console.log("Starting at..", new Date().toISOString());

  const reportsFolder = process.env.BUCKET_REPORTS;
  const surveyFile = process.env.SURVEY_FILE;

  assert.ok(reportsFolder, '"BUCKET_REPORTS" environment variable is not set');
  assert.ok(surveyFile, '"SURVEY_FILE" environment variable is not set');

  const data = JSON.parse(surveyFile);

  console.time("Elapsed time");

  const elapsedBytes = { count: 0 };
  const refSalaryTypes = {};
  const refFinalData = {
    fields: [],
    titles: [],
  };

  console.log("Downloading file on demand...");
  const fileStream = S3.getObject(data).createReadStream();

  await pipelineAsync(
    fileStream,
    csvtojson(),
    mapStream(elapsedBytes),
    processDataStream(refSalaryTypes, refFinalData)
  );

  console.log("salaryType", refSalaryTypes);

  const { filename } = await generateFile(refFinalData, refSalaryTypes);

  console.log({ filename });
  console.log('"Elapsed bytes":', formatBytes(elapsedBytes.count));

  const s3Response = await S3.putObject({
    Body: await readFile(filename),
    Key: filename,
    Bucket: `${data.Bucket}/${reportsFolder}`,
  }).promise();

  console.timeEnd("Elapsed time");

  console.log("s3Response", JSON.stringify(s3Response, null, 2));
  console.log("Finished at..", new Date().toISOString());
}

process.env.SURVEY_FILE = JSON.stringify({
  Bucket: "devleandrodias-bucket-001",
  Key: "survey_results_public.csv",
});

process.env.BUCKET_REPORTS = "reports";

main();
