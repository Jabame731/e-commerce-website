import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/paginaton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { deleteUser } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "Admin Users",
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{
    page: string;
  }>;
}) => {
  const { page = "1" } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page) });

  return (
    <div className="space-y-3">
      <h2 className="h2-bold">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge variant="default">Admin</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>

                  {/* DELETE */}
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.totalPage > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPage} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
