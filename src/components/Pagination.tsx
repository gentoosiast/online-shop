import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import { cartStore } from '../storage/cart.store';
import { IItem } from '../types/IItem';
import { ItemCardCart } from './ItemCardCart';
import styles from '../css/cart.module.css';

interface IItemsToShowProps {
  currentItems: [IItem, number][]
}

function ItemsToShow({ currentItems }: IItemsToShowProps) {
  return (
    <>
      {currentItems &&
        currentItems.map(el =>
        <ItemCardCart key={el[0].id} item={el[0]} amt={el[1]}></ItemCardCart>
        )}
    </>
  )}

interface IPaginatedItemsProps {
  itemsPerPage: number
}

export function PaginatedItems ({itemsPerPage}: IPaginatedItemsProps) {
  const items = Array.from(cartStore.items)
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPageInput,setItemsPerPageInput] = useState(itemsPerPage);

  const endOffset = itemOffset + itemsPerPageInput;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPageInput);
  const pageOffset = itemOffset/itemsPerPageInput

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    if (+e.target.value > 0) setItemsPerPageInput(+e.target.value);
    setItemOffset(0);
  }

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * itemsPerPageInput) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <><div>
        <label htmlFor="itemsPerPage">Items per page:</label>
        <input type='number' className='form-input' id='itemsPerPage'
          value={itemsPerPageInput} onChange={handleInputChange}
          ></input>
        </div>
      <ItemsToShow currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
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
