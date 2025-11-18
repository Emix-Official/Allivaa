import { GetServerSideProps } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default function Courses({ user }: { user: any }) {
  return <div>Courses for {user?.email}</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const SECRET = process.env.JWT_SECRET || "DEV_SECRET";
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token || null;
  if (!token) {
    return { redirect: { destination: "/login?redirect=/courses", permanent: false } };
  }
  try {
    const user = jwt.verify(token, SECRET);
    return { props: { user } };
  } catch {
    return { redirect: { destination: "/login?redirect=/courses", permanent: false } };
  }
};
