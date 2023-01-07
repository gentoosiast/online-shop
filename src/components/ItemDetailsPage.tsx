import React, { useState } from 'react';
import { LoaderFunctionArgs, Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { Image } from './Image';
import { fetchData } from '../fetchData';
import { IItem } from "../types/items";

import catPlaceholder from '../assets/cat-placeholder.svg';

const fetchItem = async (id: string) => {
  // TODO
  // const endpoint = `https://online-store-backend-production.up.railway.app/products/${id}`;
  const endpoint = `http://localhost:8000/products/${id}`;
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

export const ItemDetails = observer(() => {
  const navigate = useNavigate();
  const params = useParams();
    const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >
  const { data: item } = useQuery({
    ...itemQuery(params.itemId ?? '1'),
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const [mainImgIdx, setMainImgIdx] = useState(0);
  return (
    <div className="p-5 flex flex-col m-auto ">
      {item &&
        <>
          <div className="p-5 flex justify-start gap-1">
            <Link to="/"><span className='breadcrumb'>store</span></Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/?categories=${item.category}`}><span className='breadcrumb'>{item.category}</span></Link>
            <span className="breadcrumb-separator">/</span>
            <Link to={`/?brands=${item.brand}`}><span className='breadcrumb'>{item.brand}</span></Link>
            <span className="breadcrumb-separator">/</span>
            <span>{item.title}</span>
          </div>
          <div className="p-5 flex flex-col gap-5 items-center m-auto">
            <div className="flex mobile-1: flex-col laptop:flex-row gap-5">
              <div className="photos flex gap-2 items-center flex-none shrink-0 mobile-1:flex-col tablet:flex-row">
                <div className="all-pics flex mobile-1:flex-row tablet:flex-col gap-1 ">
                  {
                    item.images.map((img, i) =>
                      <div key={i} className={`card-image w-20 h-20 rounded cursor-pointer border-2 ${img === item.images[mainImgIdx] ? 'border-green-500' : 'border-transparent'}`}
                        onClick={() => setMainImgIdx(i)}>
                        <Image className="card-image-img" src={img} alt={item.title} />
                        <img className="card-image-placeholder" src={catPlaceholder} alt="cat placeholder" />
                      </div>
                    )
                  }
                </div>
                <div className="main-pic card-image w-96 h-96">
                  <Image className="card-image-img" src={item.images[mainImgIdx]} alt={item.title} />
                  <img className="card-image-placeholder" src={catPlaceholder} alt="cat placeholder" />
                </div>
              </div>
              <div className="details flex flex-col gap-2">
                <div className="font-bold text-3xl">{item.title}</div>
                <div className='price-rating flex border-b border-green-600 pb-4 justify-between'>
                  <div className='flex gap-3 items-center'>
                    <p className="font-bold text-2xl text-green-600 ">{item.price}₽</p>
                    <p className='bg-red-700 text-white rounded-md px-2 py-1'>-{item.discountPercentage}%</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Rating
                      value={item.rating}
                      readOnly={true}
                      style={{ maxWidth: 100 }}
                    />
                    <span className="text-lg">Рейтинг:</span>
                    <span>{item.rating}</span>
                </div>
                </div>
                <div>
                  <p className="font-bold">Описание:</p>
                  <p>{item.description}</p>
                </div>
                <div>
                  <span className="text-gray-500">Категория: </span>
                  <span>{item.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Бренд: </span>
                  <span>{item.brand}</span>
                </div>
                <div>
                  <span className="text-gray-500">В наличии: </span>
                  <span>{item.stock} шт.</span>
                </div>
                <div className="buttons flex gap-2 pt-4 mobile-1:flex-col tablet:flex-row">
                  <button
                    className={`button ${cartStore.isInCart(item.id) ? 'button-delete' : 'button-add'}`}
                    onClick={() => {
                      if (cartStore.isInCart(item.id)) {
                        cartStore.removeAllItems(item.id);
                      } else {
                        cartStore.addItem(item);
                      }
                    }}>
                    {cartStore.isInCart(item.id) ? 'Удалить из корзины' : 'Добавить в корзину'}
                  </button>
                  <button className='button button-buy' aria-label='Add item to the cart and proceed to filling in order details'
                    onClick={() => {
                      if (!cartStore.isInCart(item.id)) {
                        cartStore.addItem(item);
                      }
                      navigate('/cart', { state: { isModalOpen: true } });
                    }}>
                    Купить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
});
