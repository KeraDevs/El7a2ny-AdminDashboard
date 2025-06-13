import UserProfile from "@/components/users/UserProfile";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UserProfile id={id} />;
}
