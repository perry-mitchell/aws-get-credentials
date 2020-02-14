const path = require("path");
const fs = require("fs");
const pify = require("pify");
const osHomedir = require("os-homedir");
const ini = require("ini");
const VError = require("verror");

// Let-only for testing purposes
let readFile = pify(fs.readFile);
let getCredentialsClass = () => require("aws-sdk").Credentials;

// Credentials file should be at the following path:
//      ~/.aws/credentials
// As defined by Amazon: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files

/**
 * Get an AWS.Credentials instance by reading a local credentials configuration
 * @param {String=} profileOverride Optional override for the profile to use
 *  (defaults to an environment variable `AWS_DEFAULT_PROFILE` first, and then
 *  to "default" lastly)
 * @param {String=} pathOverride Optional override for the credentials path
 *  (defaults first to the environment variable `AWS_CREDENTIALS_PATH`, and
 *  then to `~/.aws/credentials` lastly)
 * @returns {Promise.<AWS.Credentials>} A promise that resolves with the AWS
 *  Credentials instance
 */
function getAWSCredentials(profileOverride, pathOverride) {
    const Credentials = getCredentialsClass();
    const awsCredentialsPath = pathOverride ||
        process.env.AWS_CREDENTIALS_PATH ||
        path.resolve(osHomedir(), "./.aws/credentials");
    const awsCredentialsProfile = profileOverride ||
        process.env.AWS_DEFAULT_PROFILE ||
        "default";
    return readFile(awsCredentialsPath, "utf8")
        .then(rawData => ini.parse(rawData))
        .then(credentialsData => {
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
        .catch(error => {
            throw new VError(error, "Failed getting credentials");
        });
};

function getAWSProfiles(pathOverride) {
    const awsCredentialsPath = pathOverride ||
        process.env.AWS_CREDENTIALS_PATH ||
        path.resolve(osHomedir(), "./.aws/credentials");
    return readFile(awsCredentialsPath, "utf8")
        .then(rawData => ini.parse(rawData))
        .then(credentials => credentials && typeof credentials === "object"
            ? Object.keys(credentials)
            : []
        )
        .catch(err => {
            throw new VError(error, "Failed getting profiles");
        });
}

module.exports = {
    getAWSCredentials,
    getAWSProfiles
};
