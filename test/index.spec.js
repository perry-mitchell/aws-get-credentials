const rewire = require("rewire");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");

const { expect } = chai;
chai.use(chaiAsPromised);

const testCreds = `
[default]

[production]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
`;

describe("getAWSCredentials", function() {

    beforeEach(function() {
        const fakeCredentials = this.fakeCredentials = {};
        const credentialsSpy = this.credentialsSpy = sinon.spy();
        this.readFileSpy = sinon.spy();
        const getAWSCredentials = rewire("../source/index.js");
        getAWSCredentials.__set__("getCredentialsClass", () => function FakeCredentials(...args) {
            credentialsSpy(...args);
            return fakeCredentials;
        });
        getAWSCredentials.__set__("readFile", (filePath) => {
            this.readFileSpy(filePath);
            return Promise.resolve(testCreds);
        });
        this.getAWSCredentials = getAWSCredentials;
    });

    it("throws when default is empty", function() {
        return expect(this.getAWSCredentials())
            .to.be.rejectedWith(/No access key ID/i);
    });

    it("creates a new Credentials instance", function() {
        return expect(this.getAWSCredentials("production"))
            .to.eventually.equal(this.fakeCredentials);
    });

    it("passes correct information to Credentials constructor", function() {
        return this.getAWSCredentials("production").then(creds => {
            expect(creds).to.equal(this.fakeCredentials);
            expect(this.credentialsSpy.calledWithExactly("AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")).to.be.true;
            expect(this.credentialsSpy.callCount).to.equal(1);
        });
    });

    it("reads the correct file", function() {
        return this.getAWSCredentials("production", "/home/user/.aws/credentials").then(() => {
            expect(this.readFileSpy.calledWithExactly("/home/user/.aws/credentials")).to.be.true;
            expect(this.readFileSpy.callCount).to.equal(1);
        });
    });

});
