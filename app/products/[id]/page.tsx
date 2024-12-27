async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 60000));
}

export default async function ProductDetail({
  params: { id },
}: {
  params: { id: string };
}) {
    const product = await getProducts();
  return <span>Product detail of the product {id}</span>;
}
