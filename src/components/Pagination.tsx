import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Input } from "@material-tailwind/react";
import { cartStore } from '../storage/cart.store';
import { CartItem} from '../types/cart';
import { ItemCardCart } from './ItemCardCart';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import styles from '../css/cart.module.css';


const nextLabelNode = (<svg className="feather next-page"><use href={`${featherSprite}#chevron-right`} /></svg>);
const prevLabelNode = (<svg className="feather prev-page"><use href={`${featherSprite}#chevron-left`} /></svg>);

interface IItemsToShowProps {
  currentItems: CartItem[];
  itemOffset: number;
}

const ItemsToShow = ({ currentItems, itemOffset }: IItemsToShowProps) => {
  return (
    <>
      {Boolean(currentItems) &&
        currentItems.map((el, i) =>
        <ItemCardCart key={el.item.id} number={i+1+itemOffset} item={el.item} amount={el.quantity}
        ></ItemCardCart>
        )}
    </>
  )}

export const PaginatedItems = () => {
  const items = Array.from(cartStore.items.values())
  const [searchParams, setSearchParams] = useSearchParams();
  const limitParam = searchParams.get("limit");
  let initialItemsPerPage = 3;
  if (limitParam) {
    const limitNum = parseInt(limitParam, 10);
    if (!Number.isNaN(limitNum) && limitNum > 0) {
      initialItemsPerPage = limitNum;
    }
  }

  const pageParam = searchParams.get("page");
  let initialPage = 0;
  const endPage = Math.ceil(items.length / initialItemsPerPage) - 1;
  if (pageParam) {
    const pageNum = parseInt(pageParam, 10) - 1;
    if (!Number.isNaN(pageNum) && pageNum >= 0) {
      initialPage = Math.min(endPage, pageNum);
    }
  }

  const [pageOffset, setPageOffset] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [itemsPerPageInput, setItemsPerPageInput] = useState(itemsPerPage.toString());
  if (initialItemsPerPage !== itemsPerPage) {
    setItemsPerPage(initialItemsPerPage);
  }

  const [itemOffset, setItemOffset] = useState(pageOffset * itemsPerPage);
  if (initialPage !== pageOffset) {
    setPageOffset(initialPage);
    setItemOffset(initialPage * itemsPerPage);
  }

  // last item on the page deleted
  useEffect(() => {
    const endPage = Math.ceil(items.length / itemsPerPage);
    if (pageParam && parseInt(pageParam, 10) > endPage) {
      searchParams.set("page", (endPage).toString());
      setSearchParams(searchParams);
    }
  });

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPageInput(e.target.value);
    const newItemsPerPage = parseInt(e.target.value, 10);
    if (!Number.isNaN(newItemsPerPage) && newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
      const newPageCount = Math.ceil(items.length / newItemsPerPage);
      const newPageOffset = pageOffset > newPageCount - 1 ? newPageCount - 1 : pageOffset;
      if (newPageOffset !== pageOffset) {
        setPageOffset(newPageOffset);
        searchParams.set("page", (newPageOffset + 1).toString());
        setSearchParams(searchParams);
      }
      setItemOffset(newPageOffset * newItemsPerPage);
      searchParams.set("limit", e.target.value);
      setSearchParams(searchParams);
    }
  }

  const handleItemsPerPageBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value, 10);
    if (Number.isNaN(inputValue) || inputValue <= 0) {
      setItemsPerPageInput(itemsPerPage.toString());
    }
  }

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setPageOffset(selected);
    searchParams.set("page", (selected + 1).toString());
    setSearchParams(searchParams);
  };

  return (
    <>
      <div>
        <div className='w-20 pb-4'>
          {/* <label htmlFor="itemsPerPage">Товаров на странице:</label> */}
          <Input type='number' className='form-input' id='itemsPerPage'
          label="Товаров на странице:" color='green'
            value={itemsPerPageInput} onChange={handleItemsPerPageChange} onBlur={handleItemsPerPageBlur}
          />
        </div>
        <div className="flex px-8 p-3 border-b border-green-500">
          <p className='font-bold w-10'>№</p>
          <p className='font-bold w-96'>Товар</p>
          <p className='font-bold w-24'></p>
          <p className='font-bold w-44'>Количество</p>
          <p className='font-bold '>Цена</p>
        </div>
      </div>
      <ItemsToShow currentItems={currentItems} itemOffset={itemOffset} />
      <ReactPaginate
        breakLabel="..."
        nextLabel={nextLabelNode}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel={prevLabelNode}
        containerClassName={styles.Pagination__container}
        activeClassName={styles.Pagination__active}
        activeLinkClassName = {styles.Pagination__active__link}
        nextLinkClassName=""
        previousLinkClassName=""
        pageClassName={styles.Pagination__page}
        nextClassName={styles.Pagination__next}
        previousClassName={styles.Pagination__prev}
        disabledClassName = {styles.Pagination__disabled}
        disabledLinkClassName = {styles.Pagination__disabled__link}
        forcePage={pageOffset}
      />
    </>
  );
}
