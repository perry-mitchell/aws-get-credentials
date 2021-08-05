const path = require("path");
const fs = require("fs");
const os = require("os");
const pify = require("pify");
const ini = require("ini");
const VError = require("verror");

const readFile = pify(fs.readFile);
const getCredentialsClass = () => require("aws-sdk").Credentials;

// Credentials file should be at the following path:
//      ~/.aws/credentials
// As defined by Amazon: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files

/**
 * @module GetAWSCredentials
 */

/**
 * Get an AWS.Credentials instance by reading a local credentials configuration
 * @param {String=} profileOverride Optional override for the profile to use
 *  (defaults to an environment variable `AWS_PROFILE` first, then
 *  `AWS_DEFAULT_PROFILE` second, and then to "default" lastly)
 * @param {String=} pathOverride Optional override for the credentials path
 *  (defaults first to the environment variable `AWS_CREDENTIALS_PATH`, and
 *  then to `~/.aws/credentials` lastly)
 * @param {Boolean=} useEnvironmentVariables Optionally allow environment
 *  variables to provide the Credentials instance. This disregards the profile
 *  and assumes that the token in the environment variables is desired. Does
 *  not read the credentials file if the envirnment variables
 *  "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" are present. Defaults to
 *  false.
 * @returns {Promise.<AWS.Credentials>} A promise that resolves with the AWS
 *  Credentials instance
 * @memberof module:GetAWSCredentials
 */
async function getAWSCredentials(profileOverride, pathOverride, useEnvironmentVariables = false) {
    const Credentials = getCredentialsClass();
    if (useEnvironmentVariables) {
        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
        if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
            return new Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);
        }
    }
    const awsCredentialsPath =
        pathOverride ||
        process.env.AWS_CREDENTIALS_PATH ||
        path.resolve(os.homedir(), "./.aws/credentials");
    const awsCredentialsProfile =
        profileOverride || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || "default";
    const rawData = await readFile(awsCredentialsPath, "utf8");
    const credentialsData = ini.parse(rawData);
    const { aws_access_key_id: accessKey, aws_secret_access_key: secretKey } = credentialsData[
        awsCredentialsProfile
    ];
    if (typeof accessKey !== "string") {
        throw new VError(
            `Failed getting credentials: No access key ID for profile: ${awsCredentialsProfile}`
        );
    }
    if (typeof secretKey !== "string") {
        throw new VError(
            `Failed getting credentials: No secret access key for profile: ${awsCredentialsProfile}`
        );
    }
    return new Credentials(accessKey, secretKey);
}

/**
 * Get an array of available AWS profiles
 * @param {String=} pathOverride Optional AWS credentials file path override
 * @returns {Promise.<String[]>}
 * @memberof module:GetAWSCredentials
 */
function getAWSProfiles(pathOverride) {
    const awsCredentialsPath =
        pathOverride ||
        process.env.AWS_CREDENTIALS_PATH ||
        path.resolve(os.homedir(), "./.aws/credentials");
    return readFile(awsCredentialsPath, "utf8")
        .then(rawData => ini.parse(rawData))
        .then(credentials =>
            credentials && typeof credentials === "object" ? Object.keys(credentials) : []
        )
        .catch(err => {
            throw new VError(error, "Failed getting profiles");
        });
}

module.exports = {
    getAWSCredentials,
    getAWSProfiles
};
