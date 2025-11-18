import { GetServerSideProps } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";

interface DecodedToken {
  email: string;
  role: string;
}

export default function AdminDashboard({ user }: { user: DecodedToken }) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <ul>
        <li><a href="/admin/users">Manage Users</a></li>
        <li><a href="/admin/courses">Manage Courses</a></li>
        <li><a href="/admin/analytics">Analytics</a></li>
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const SECRET = process.env.JWT_SECRET || "DEV_SECRET";
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token || null;
  if (!token) return { redirect: { destination: "/admin/login", permanent: false } };
  try {
    const user = jwt.verify(token, SECRET) as DecodedToken;
    if (user.role !== "admin") return { redirect: { destination: "/403", permanent: false } };
    return { props: { user } };
  } catch {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
};
