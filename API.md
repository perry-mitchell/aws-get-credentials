<a name="module_GetAWSCredentials"></a>

## GetAWSCredentials

* [GetAWSCredentials](#module_GetAWSCredentials)
    * [.getAWSCredentials([profileOverride], [pathOverride], [useEnvironmentVariables])](#module_GetAWSCredentials.getAWSCredentials) ⇒ <code>Promise.&lt;AWS.Credentials&gt;</code>
    * [.getAWSProfiles([pathOverride])](#module_GetAWSCredentials.getAWSProfiles) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>

<a name="module_GetAWSCredentials.getAWSCredentials"></a>

### GetAWSCredentials.getAWSCredentials([profileOverride], [pathOverride], [useEnvironmentVariables]) ⇒ <code>Promise.&lt;AWS.Credentials&gt;</code>
Get an AWS.Credentials instance by reading a local credentials configuration

**Kind**: static method of [<code>GetAWSCredentials</code>](#module_GetAWSCredentials)  
**Returns**: <code>Promise.&lt;AWS.Credentials&gt;</code> - A promise that resolves with the AWS
 Credentials instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [profileOverride] | <code>String</code> |  | Optional override for the profile to use  (defaults to an environment variable `AWS_PROFILE` first, then  `AWS_DEFAULT_PROFILE` second, and then to "default" lastly) |
| [pathOverride] | <code>String</code> |  | Optional override for the credentials path  (defaults first to the environment variable `AWS_CREDENTIALS_PATH`, and  then to `~/.aws/credentials` lastly) |
| [useEnvironmentVariables] | <code>Boolean</code> | <code>false</code> | Optionally allow environment  variables to provide the Credentials instance. This disregards the profile  and assumes that the token in the environment variables is desired. Does  not read the credentials file if the envirnment variables  "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" are present. Defaults to  false. |

<a name="module_GetAWSCredentials.getAWSProfiles"></a>

### GetAWSCredentials.getAWSProfiles([pathOverride]) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Get an array of available AWS profiles

**Kind**: static method of [<code>GetAWSCredentials</code>](#module_GetAWSCredentials)  

| Param | Type | Description |
| --- | --- | --- |
| [pathOverride] | <code>String</code> | Optional AWS credentials file path override |

