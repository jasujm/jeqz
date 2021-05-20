import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiHttp);
chai.use(chaiAsPromised);

export const expect = chai.expect;
export const request = chai.request;
