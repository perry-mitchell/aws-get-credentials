const path = require("path");
const { Credentials } = require("aws-sdk");
const { getAWSCredentials, getAWSProfiles } = require("../../source/index.js");

describe("index", function() {
    const SAMPLE = path.resolve(__dirname, "../sample-credentials");

    describe("getAWSCredentials", function() {
        it("returns expected credentials", function() {
            return getAWSCredentials("mycompany-production", SAMPLE).then(creds => {
                expect(creds).to.be.an.instanceOf(Credentials);
            });
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
