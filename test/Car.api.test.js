const request = require("supertest");
const app = require("../app");
const dotenv = require("dotenv");

dotenv.config();

jest.setTimeout(10000); // Set global timeout to 10 seconds

describe("API get all cars", () => {
  it("success get all data cars", async () => {
    const response = await request(app).get("/v1/cars");
    expect(response.statusCode).toBe(200);
  });
});

describe("API get car By ID", () => {
  it("success get data car", async () => {
    const response = await request(app).get("/v1/cars/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });
});

describe("API create car", () => {
  const carData = {
    name: "Suzuki",
    price: 300000,
    size: "SMALL",
    image:
      "https://unsplash.com/photos/a-group-of-antelope-standing-in-the-desert-i60yUhfWeYI",
  };

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkpvaG5ueSIsImVtYWlsIjoiam9obm55QGJpbmFyLmNvLmlkIiwiaW1hZ2UiOm51bGwsInJvbGUiOnsiaWQiOjIsIm5hbWUiOiJBRE1JTiJ9LCJpYXQiOjE2OTk4ODU1NDF9.ZMTs6GtxtXjixTa-s-ok2JQg--HwD4k6W_gfNHYqQUQ";

  it("success create data car", async () => {
    const response = await request(app)
      .post("/v1/cars")
      .send(carData)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("name", "Suzuki");
  });

  it("failed create data car without token", async () => {
    const response = await request(app).post("/v1/cars").send(carData);
    expect(response.statusCode).toBe(401);
  });

  it("failed create data car if body is null", async () => {
    const response = await request(app)
      .post("/v1/cars")
      .send({})
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(422);
  });
});

describe("API delete car By ID", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IkpvaG5ueSIsImVtYWlsIjoiam9obm55QGJpbmFyLmNvLmlkIiwiaW1hZ2UiOm51bGwsInJvbGUiOnsiaWQiOjIsIm5hbWUiOiJBRE1JTiJ9LCJpYXQiOjE2OTk4ODU1NDF9.ZMTs6GtxtXjixTa-s-ok2JQg--HwD4k6W_gfNHYqQUQ";

  it("success delete data car", async () => {
    // First create a car to ensure there's a car to delete
    const carData = {
      name: "Test Car",
      price: 100000,
      size: "SMALL",
      image: "https://example.com/image.jpg",
    };

    const createResponse = await request(app)
      .post("/v1/cars")
      .send(carData)
      .set("Authorization", `Bearer ${token}`);

    const carId = createResponse.body.id;

    // Now delete the car
    const deleteResponse = await request(app)
      .delete(`/v1/cars/${carId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteResponse.statusCode).toBe(204);
  });

  it("failed delete data car: car not found", async () => {
    const invalidCarId = 99999; // Assuming this ID does not exist in your database
    const response = await request(app)
      .delete(`/v1/cars/${invalidCarId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
  });
});

describe("API rent car", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6Ikpvam8iLCJlbWFpbCI6Impvam9AYmluYXIuY28uaWQiLCJpbWFnZSI6bnVsbCwicm9sZSI6eyJpZCI6MSwibmFtZSI6IkNVU1RPTUVSIn0sImlhdCI6MTcwMDAzNjY0MH0.fqJLyXERO8SzlY478mb2_BTgc7WaDIf3vRjgca3k6qE";

  it("success rent car", async () => {
    const response = await request(app)
      .post("/v1/cars/5/rent")
      .set("Authorization", `Bearer ${token}`)
      .send({ rentStartedAt: "2023-11-15T07:20:30.014Z" });
    expect(response.statusCode).toBe(201);
  });

  it("failed rent car: car not found", async () => {
    const response = await request(app)
      .post("/v1/cars/100101/rent")
      .set("Authorization", `Bearer ${token}`)
      .send({ rentStartedAt: "2023-11-15T07:20:30.014Z" });
    expect(response.statusCode).toBe(404);
  });
});
