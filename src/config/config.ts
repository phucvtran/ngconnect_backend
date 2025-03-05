//database configuration and cors config for the website.
const config = {
  getDataBaseConfig: () => ({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
  }),
  corsOptions: {
    origin: `${process.env.HOST}:3000`, // Replace with your frontend URL
    // origin: "http://18.224.153.196:3000", // front-end api
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Accept", "Authorization"], // Allowed headers
  },
};
export default config;
