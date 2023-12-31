const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config({ path: "./config/.env" });
const db = require("./config/db");

const port = process.env.PORT || 5000;
const userRoute = require("./routes/userRoutes");
const hotelRoute = require("./routes/hotelRoutes");
const bookingRoute = require("./routes/bookingRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Booking Platform API",
      description:
        "A REST API built with Express and MongoDB. This API provides CRUD Operations on Hotels, Bookings and Users.",
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: "http://localhost:5000/",
          description: "Localhost development server"
        },
        {
          url: "https://hotel-booking-9icz.onrender.com/",
          description: "Remote deployment on render.com"
        }
      ],
  },
  apis: ["./routes/*.js"],
};

app.use("/api/users", userRoute);
app.use("/api/hotels", hotelRoute);
app.use("/api/bookings", bookingRoute);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});