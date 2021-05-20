import chai from "chai";
import chaiDom from "chai-dom";
import sinonChai from "sinon-chai";

chai.use(chaiDom);
chai.use(sinonChai);

export const expect = chai.expect;
