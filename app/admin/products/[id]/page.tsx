import { getProductById } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Product",
};

const AdminProductUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  if (!id) return notFound();

  const product = await getProductById(id);

  if (!product) {
    return notFound();
  }

  return <></>;
};

export default AdminProductUpdatePage;
