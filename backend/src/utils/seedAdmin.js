import User from "../models/User.js";

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@careerstack.com";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) return;

  await User.create({
    name: process.env.ADMIN_NAME || "Admin",
    email: adminEmail,
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  });

  console.log("Default admin seeded");
};

export default seedAdmin;