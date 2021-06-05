import app from "../index";
import request from "supertest";

describe("GET / - a simple test of the root api endpoint", () => {
  it("Hello API Request", async () => {
    const result = await request(app).get("/");
    expect(result.text).toEqual("Hello world!");
    expect(result.statusCode).toEqual(200);
  });
});