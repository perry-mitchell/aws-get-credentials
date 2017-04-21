const path = require("path");
const fs = require("fs");
const pify = require("pify");
const osHomedir = require("os-homedir");
const ini = require("ini");
const VError = require("verror");
const { Credentials } = require("aws-sdk");

const readFile = pify(fs.readFile);

// Credentials file should be at the following path:
//      ~/.aws/credentials
// As defined by Amazon: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files

module.exports = function getAWSCredentials(profileOverride, pathOverride) {
    const awsCredentialsPath = pathOverride ||
        process.env.AWS_CREDENTIALS_PATH ||
        path.resolve(osHomedir(), "./.aws/credentials");
    const awsCredentialsProfile = profileOverride ||
        process.env.AWS_DEFAULT_PROFILE ||
        "default";
    return readFile(awsCredentialsPath, "utf8")
        .then(rawData => ini.parse(rawData))
        .then(function _handleCredentialsConfig(credentialsData) {
            const {
                aws_access_key_id: accessKey,
                aws_secret_access_key: secretKey
            } = credentialsData[awsCredentialsProfile];
            if (typeof accessKey !== "string") {
                throw new VError(`No access key ID for profile: ${awsCredentialsProfile}`);
            }
            if (typeof secretKey !== "string") {
                throw new VError(`No secret access key for profile: ${awsCredentialsProfile}`);
            }
            return new Credentials(accessKey, secretKey);
        })
        .catch(function _handleFailure(error) {
            throw new VError(error, "Failed getting credentials");
        });
};
