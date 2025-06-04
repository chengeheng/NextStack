import User from "@/server/models/user";
import { UserType } from "@/types/server/user";

const authService = {
  async getUserList() {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw new Error("Failed to fetch user list");
    }
  },
  async addUser(userData: {
    username: string;
    password: string;
    role: number;
  }) {
    try {
      const newUser = new User({
        username: userData.username,
        password: userData.password,
        role: userData.role,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user");
    }
  },
};

export default authService;
