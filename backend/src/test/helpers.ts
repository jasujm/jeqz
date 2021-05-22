import chai from "chai";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import deepEqualInAnyOrder from "deep-equal-in-any-order";

chai.use(chaiHttp);
chai.use(chaiAsPromised);
chai.use(deepEqualInAnyOrder);

export const expect = chai.expect;
export const request = chai.request;
