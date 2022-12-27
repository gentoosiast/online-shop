import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
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
        <ItemCardCart key={el.item.id} number={i+1+itemOffset} item={el.item} amount={el.quantity}></ItemCardCart>
        )}
    </>
  )}

interface IPaginatedItemsProps {
  itemsPerPage: number
}

export const PaginatedItems = ({itemsPerPage}: IPaginatedItemsProps) => {
  const items = Array.from(cartStore.items.values())
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPageInput,setItemsPerPageInput] = useState(itemsPerPage);

  const endOffset = itemOffset + itemsPerPageInput;
  const currentItems = items.slice(itemOffset, endOffset);
  if (currentItems.length === 0) {
    setItemOffset(prev => prev-itemsPerPageInput);
  }
  const pageCount = Math.ceil(items.length / itemsPerPageInput);
  const pageOffset = itemOffset/itemsPerPageInput;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    if (+e.target.value > 0) {
      setItemsPerPageInput(+e.target.value);
    }
    setItemOffset(0);
  }

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * itemsPerPageInput) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className='flex items-center gap-2'>
        <label htmlFor="itemsPerPage">Items per page:</label>
        <input type='number' className='form-input' id='itemsPerPage'
          value={itemsPerPageInput} onChange={handleInputChange}
        />
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
