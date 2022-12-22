import React, { useState } from 'react';
import { LoaderFunctionArgs, Link, useLoaderData, useParams } from "react-router-dom";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { IItem } from "../types/IItem";
import { fetchData } from '../fetchData';

const fetchItem = async (id: string) => {
  const endpoint = `https://dummyjson.com/products/${id}`;
  try {
    const data = await fetchData<IItem>(endpoint);
    return data;
  } catch(e) {
    throw new Error(e instanceof Error ? e.message : "fetchItem: Some error occured");
  }
}

const itemQuery = (id: string) => ({
  queryKey: ['item', id],
  queryFn: async () => fetchItem(id),
  refetchOnWindowFocus: false,
});


export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs): Promise<IItem> => {
    const query = itemQuery(params.itemId ?? '1');
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export function ItemDetails() {
  const params = useParams();
    const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >
  const { data: item } = useQuery({
    ...itemQuery(params.itemId ?? '1'),
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const [inCart, setInCart] = useState(false);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  return (
    <div className="border p-5 rounded flex flex-col items-center m-auto">
      {item &&
        <>
          <div className="p-5 flex justify-evenly items-center gap-1">
            <Link to="/"><span>store</span></Link>
            <span className="breadcrumb">/</span>
            <span>{item.category}</span>
            <span className="breadcrumb">/</span>
            <span>{item.brand}</span>
            <span className="breadcrumb">/</span>
            <span>{item.title}</span>
          </div>
          <div className="border p-5 rounded flex flex-col gap-5 items-center m-auto">
            <div className="font-bold text-6xl">{item.title}</div>
            <div className="flex flex-row gap-5">
              <div className="photos flex gap-2 items-center">
                <div className="all-pics flex flex-col gap-1">
                  {
                    // TODO: images from different URLs can be duplicates
                    item.images.map((img, i) =>
                      <img key={i} src={img} className={`w-24 rounded cursor-pointer border-2
                        ${img === item.images[mainImgIdx] ? "border-blue-600": "border-transparent"}`} alt={item.title}
                        onClick = {() => setMainImgIdx(i)}
                      ></img>)
                  }
                </div>
                <div className="main-pic">
                  <img src={item.images[mainImgIdx]} className="w-72 rounded" alt={item.title}/>
                </div>
              </div>
              <div className="details flex flex-col gap-2">
                <div>
                  <p className="font-bold text-lg">Description:</p>
                  <p>{item.description}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Discount:</p>
                  <p>{item.discountPercentage}%</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Rating:</p>
                  <p>{item.rating}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Stock:</p>
                  <p>{item.stock}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Brand:</p>
                  <p>{item.brand}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Category:</p>
                  <p>{item.category}</p>
                </div>
              </div>
              <div className="addtocart flex flex-col justify-center items-center gap-10">
                <p className="font-bold text-5xl">${item.price}</p>
                <div className="flex flex-col gap-2">
                  <button
                    className={`button ${inCart ? 'button-delete' : 'button-add'}`}
                    onClick={() => setInCart(prev => !prev)}
                    >
                      {inCart ? 'remove from cart' : 'add to cart'}
                  </button>
                  <button
                    className='button button-buy'>
                      buy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}
