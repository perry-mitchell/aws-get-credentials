# aws-get-credentials
> Create an AWS credentials instance from local credentials

[![npm version](https://badge.fury.io/js/aws-get-credentials.svg)](https://www.npmjs.com/package/aws-get-credentials) [![Build Status](https://travis-ci.org/perry-mitchell/aws-get-credentials.svg?branch=master)](https://travis-ci.org/perry-mitchell/aws-get-credentials)

## About

Fetch a credentials instance from your local machine using a very simple fetcher method.

Avoid hardcoding and commiting secure information by using [AWS' credentials file](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files) for configuration. Some AWS client libraries automatically read this file, but some do not. **aws-get-credentials** provides a quick and easy method to retrieve a credential file's config.

## Usage

The `aws-get-credentials` module exports two methods:

 * `getAWSCredentials` - Fetch an AWS `Credentials` instance from local configuration
 * `getAWSProfiles` - Get an array of profile names available

Check out the [API documentation](API.md) for more information.

### getAWSCredentials

The method `getAWSCredentials` takes two parameters:

```javascript
getAWSCredentials(optionalProfileOverride, optionalPathOverride) // => Promise.<AWS.Credentials>
```

`optionalProfileOverride` is an optional override for the profile to use (defaults to an environment variable `AWS_DEFAULT_PROFILE` first, then "default" lastly). `optionalPathOverride` is an optional override for the path to the credentials file (defaults to an environment variable `AWS_CREDENTIALS_PATH` first, and then `~/.aws/credentials` lastly).

#### Example

Firstly, import the function:

```javascript
const { getAWSCredentials } = require("aws-get-credentials");
```

Then use its output (promise):

```javascript
const s3 = require("s3"); // example library

getAWSCredentials("production")
    .then(function(credentials) {
        const s3Client = s3.createClient({
            s3Options: {
                credentials
            }
        });
        const syncOptions = {};
        const uploader = s3Client.uploadDir(syncOptions);
        return new Promise(function(resolve, reject) {
            uploader.on("error", reject);
            uploader.on("end", resolve);
        });
    });
```

### getAWSProfiles

This method asynchronously fetches a list of profile names in the credentials file:

```javascript
const { getAWSProfiles } = require("aws-get-credentials");

getAWSProfiles().then(profiles => {
    // [
    //     "company-prod",
    //     "company-stag",
    //     "default"
    // ]
});
```
