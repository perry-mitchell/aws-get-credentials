# AWS-Get-Credentials changelog

## v2.0.0
_2021-08-05_

 * `useEnvironmentVariables` option for `getAWSCredentials`, allowing the method to return environment variables if present
 * Minimum Node version is now `12`

## v1.1.0
_2020-09-06_

 * Read `AWS_PROFILE` before `AWS_DEFAULT_PROFILE`

## v1.0.0
_2020-02-14_

 * `getAWSProfiles` method
 * **Breaking changes:**
   * Node minimum version is now **10**
   * Removed `getAWSCredentials` method from module **root** -> `module.getAWSCredentials`

## v0.1.0

 * Initial release
