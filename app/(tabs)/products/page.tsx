async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function Products() {
  const product = await getProducts();

  return <div>Product Home</div>;
}
