"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/action";

interface ProductListProps {
  initialProducts: InitialProducts;
}
export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // getElementByID에서 Elemenmet를 찾아 가지고 오는 것처럼 여기서는 span을 가지고 옴
  const trigger = useRef<HTMLSpanElement>(null);

  //page가 변경될때 이 함수가 다시 실행됨, 즉 남은 아이템이 없어서 page가 변경되지 않을때 unmount됨
  useEffect(() => {
    // trigger를 observe할 IntersectionObserver를 생성
    const observer = new IntersectionObserver(
      async (
        //함수의 첫번째 인자는 intersectionObserver가 observe(관찰)하는 모든 요소 = entries: 많은 element의 array
        //두번째 인자는 Observer 그 자체
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        // 현재 하나의 element(요소)만 observe하고 있기때문에 인덱스 0으로 첫번째 element를 추출함
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);

          //newProducts의 길이가 0이 아닌 경우 즉 product가 아직 더 있다면 새 page를 추가, 즉 더 이상 보여줄 상품이 없으면 page추가 하지 않음
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }
          // ... => array의 element로 풀어주는 것 not [1],[2] => [1, 2] 즉 이전의 상품 + 새로운 상품 합침
          setProducts((prev) => [...prev, ...newProducts]);
          setIsLoading(false);
        }
        console.log("isIntersectiong: ", entries[0].isIntersecting);
      },
      {
        //item(button)이 50% 표시되면, intersectionObserver는 intersecting으로 표시하지 않음.
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    // span에 tirgger가 추가되고 null이 아닌 경우, trigger를 observe(관찰)함
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    //cleanup function (when the user leave the page (unmount))
    return () => {
      observer.disconnect();
    };
  }, [page]); // page는 이 useEffect의 dependency, 즉 page가 변화가 있으면 이 useEffect는 한번 더 실행됨
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        // button 대신 trigger를 이용, trigger가 보이면 page를 증가시킴
        // 이것을 하기위해 useEffect 내부에 IntersectionObserver를 만듬
        <span
          ref={trigger}
          style={{ marginTop: `${page + 1 * 900}vh` }}
          className="mb-96 text-sm font-semidbold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load More"}
        </span>
      ) : null}
    </div>
  );
}
