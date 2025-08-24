const AWS = require("aws-sdk");
const {
  SPACES_ENDPOINT,
  SPACES_NAME,
  SPACES_KEY,
  SPACES_SECRET,
} = require("./spaces");
const logger = require("../../utils/logger");

const s3 = new AWS.S3({
  endpoint: SPACES_ENDPOINT,
  accessKeyId: SPACES_KEY,
  secretAccessKey: SPACES_SECRET,
});

module.exports = async function createSignedPost(args) {
  const fileName = args.file_name;
  const contentType = args.content_type;

  const params = {
    Bucket: SPACES_NAME,
    Fields: {
      "Content-Type": contentType,
      key: fileName,
    },
    Expires: 300,
    Conditions: [{ acl: "public-read" }],
  };

  try {
    const signedPayload = await new Promise((resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
          logger.error("S3 createPresignedPost error", err, { data });
          return;
        }
        resolve(data);
      });
    });

    return {
      statusCode: 200,
      body: {
        payload: signedPayload,
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: {
        message: `unable to get signed url: ${error.message}`,
      },
    };
  }
};
