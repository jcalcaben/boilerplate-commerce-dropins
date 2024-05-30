/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

// Dropin Tools
import { initializers } from '@dropins/tools/initializer.js';
import { events } from '@dropins/tools/event-bus.js';

// Dropin APIs
import * as checkout from '@dropins/storefront-checkout/api.js';

// Dropin Providers
import { render as provider } from '@dropins/storefront-checkout/render.js';
import { render as cartProvider } from '@dropins/storefront-cart/render.js';

// Drop-in Containers
import ShippingForm from '@dropins/storefront-checkout/containers/ShippingForm.js';
import ShippingMethods from '@dropins/storefront-checkout/containers/ShippingMethods.js';
/* import CheckoutOrderSummary from '@dropins/storefront-checkout/containers/OrderSummary.js'; */

import CartOrderSummary from '@dropins/storefront-cart/containers/OrderSummary.js';
import CartItemsList from '@dropins/storefront-cart/containers/CartItemsList.js';

export default async function decorate(block) {
  // Initialize Drop-ins
  initializers.register(checkout.initialize, {});

  // Listen for order confirmation and redirect to order confirmation page
  events.on('checkout/order', (data) => {
    const orderRef = encodeURIComponent(data.token);
    window.location.replace(`/order-confirmation?orderRef=${orderRef}`);
  });

  events.on('cart/data', (data) => {
    const { id: cartId } = data;
    checkout.getCheckoutData(cartId);
  }, { eager: true });

  const checkoutContainer = document.createElement('div');
  checkoutContainer.classList.add('checkout-root');
  checkoutContainer.id = 'checkout-container';

  const leftColumn = document.createElement('div');
  leftColumn.classList.add('checkout-left-column');

  const rightColumn = document.createElement('div');
  rightColumn.classList.add('checkout-right-column');

  const shippingFormContainer = document.createElement('div');
  shippingFormContainer.id = 'shipping-form-container';

  const shippingMethodsContainer = document.createElement('div');
  shippingMethodsContainer.id = 'shipping-methods';

  const orderSummaryContainer = document.createElement('div');
  orderSummaryContainer.id = 'order-summary-container';

  const checkoutOrderSummaryContainer = document.createElement('div');
  checkoutOrderSummaryContainer.id = 'checkout-order-summary-container';

  const cartOrderSummaryContainer = document.createElement('div');
  cartOrderSummaryContainer.id = 'cart-order-summary-container';

  const cartItemsListContainer = document.createElement('div');
  cartItemsListContainer.id = 'cart-items-list-container';

  leftColumn.append(shippingFormContainer);
  leftColumn.append(shippingMethodsContainer);
  /*   rightColumn.append(checkoutOrderSummaryContainer); */
  rightColumn.append(cartOrderSummaryContainer);
  rightColumn.append(cartItemsListContainer);

  checkoutContainer.append(leftColumn);
  checkoutContainer.append(rightColumn);

  provider.render(ShippingForm, {})(shippingFormContainer);
  provider.render(ShippingMethods, {})(shippingMethodsContainer);
  /*   provider.render(CheckoutOrderSummary, {})(checkoutOrderSummaryContainer); */

  cartProvider.render(CartOrderSummary, {
    allowEstimateShipping: false,
  })(cartOrderSummaryContainer);
  cartProvider.render(CartItemsList, {})(cartItemsListContainer);

  block.append(checkoutContainer);

  return block;
}
