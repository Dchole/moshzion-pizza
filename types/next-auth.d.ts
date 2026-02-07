import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      image?: string;
      phone: string;
      firstName?: string;
      lastName?: string;
    };
  }

  interface User {
    phone: string;
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone: string;
    firstName?: string;
    lastName?: string;
  }
}
