import UserProfile from "@/components/users/UserProfile";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  return <UserProfile id={id} />;
}
