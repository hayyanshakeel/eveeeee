'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from 'components/cart/cart-context';
import { DeleteItemButton } from 'components/cart/delete-item-button';
import { EditItemQuantityButton } from 'components/cart/edit-item-quantity-button';
import LoadingDots from 'components/loading-dots';
import OpenCart from 'components/cart/open-cart';
import Price from 'components/price';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';

export default function CartModal() {
  const { cart, loading } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart && cart.totalQuantity !== quantityRef.current) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart.totalQuantity;
    }
  }, [isOpen, cart, quantityRef]);

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  }

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
                    <XMarkIcon className="h-6 transition-all ease-in-out hover:scale-110" />
                  </div>
                </button>
              </div>

              {loading && !cart ? (
                 <div className="mt-20 flex w-full flex-col items-center justify-center">
                    <LoadingDots className="bg-black dark:bg-white" />
                 </div>
              ) : !cart || cart.items.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto py-4">
                    {cart.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                      >
                        <div className="relative flex w-full flex-row justify-between px-1 py-4">
                          <div className="absolute z-40 -ml-1 -mt-2">
                            <DeleteItemButton item={item} />
                          </div>
                          <div className="flex flex-row">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              {item.product?.imageUrl ? (
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.product.title}
                                  src={item.product.imageUrl}
                                />
                              ) : <div className="h-full w-full bg-gray-200"/>}
                            </div>
                            <Link
                              href={`/product/${item.product?.handle}`}
                              onClick={closeCart}
                              className="z-30 ml-2 flex flex-row space-x-4"
                            >
                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">{item.product?.title}</span>
                              </div>
                            </Link>
                          </div>
                          <div className="flex h-16 flex-col justify-between">
                            <Price
                              className="flex justify-end space-y-2 text-right text-sm"
                              amount={formatPrice(item.price * item.quantity)}
                              currencyCode="USD"
                            />
                            <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                              <EditItemQuantityButton item={item} type="minus" />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">{item.quantity}</span>
                              </p>
                              <EditItemQuantityButton item={item} type="plus" />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>Taxes</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={formatPrice(cart.totalPrice)}
                        currencyCode="USD"
                      />
                    </div>
                  </div>
                  <button
                    className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
