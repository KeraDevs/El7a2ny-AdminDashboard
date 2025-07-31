import UserProfile from "@/components/users/UserProfile";

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  return [];
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UserProfile id={id} />;
}
