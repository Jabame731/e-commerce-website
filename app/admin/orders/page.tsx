import { auth } from "@/auth";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/paginaton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  await requireAdmin();
  const { page = "1" } = await props.searchParams;

  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authorized");
  }

  const orders = await getAllOrders({
    page: Number(page),
    // limit: 2,
  });

  return (
    <div className="space-y-3">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>

                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Not Paid"}
                </TableCell>

                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "Not Delivered"}
                </TableCell>

                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>

                  {/* DELETE */}
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
