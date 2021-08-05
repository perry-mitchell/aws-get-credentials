const path = require("path");
const { Credentials } = require("aws-sdk");
const { getAWSCredentials, getAWSProfiles } = require("../../source/index.js");

describe("index", function() {
    const SAMPLE = path.resolve(__dirname, "../sample-credentials");

    describe("getAWSCredentials", function() {
        afterEach(function() {
            process.env.AWS_ACCESS_KEY_ID = undefined;
            process.env.AWS_SECRET_ACCESS_KEY = undefined;
        });

        it("returns expected credentials", async function() {
            const creds = await getAWSCredentials("mycompany-production", SAMPLE);
            expect(creds).to.be.an.instanceOf(Credentials);
            expect(creds.accessKeyId).to.equal("AAABBBCCCDDD");
            expect(creds.secretAccessKey).to.equal("YXNkYXNmc2Rmc2RmZ2RnZGZnZGdkZmdk");
        });

        it("returns expected credentials when using environment variables", async function() {
            process.env.AWS_ACCESS_KEY_ID = "test1";
            process.env.AWS_SECRET_ACCESS_KEY = "test2";
            const creds = await getAWSCredentials("mycompany-production", SAMPLE, true);
            expect(creds).to.be.an.instanceOf(Credentials);
            expect(creds.accessKeyId).to.equal("test1");
            expect(creds.secretAccessKey).to.equal("test2");
        });
    });

    describe("getAWSProfiles", function() {
        it("returns all profiles", function() {
            return getAWSProfiles(SAMPLE).then(profiles => {
                expect(profiles).to.deep.equal([
                    "mycompany-production",
                    "mycompany-staging",
                    "personal"
                ]);
            });
        });
    });
});
