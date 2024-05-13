/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

// Drop-in Tools
import { initializers } from '@dropins/tools/initializer.js';

// Drop-in APIs
import { addProductsToCart } from '@dropins/storefront-cart/api.js';
import * as product from '@dropins/storefront-pdp/api.js';

// Drop-in Providers
import { render as productRenderer } from '@dropins/storefront-pdp/render.js';

// Drop-in Containers
import ProductDetails from '@dropins/storefront-pdp/containers/ProductDetails.js';

// Libs
import { getSkuFromUrl } from '../../scripts/commerce.js';
import { getConfigValue } from '../../scripts/configs.js';

export default async function decorate(block) {
  // Initialize Drop-ins
  initializers.register(product.initialize, {});

  // Set Fetch Endpoint (Service)
  product.setEndpoint(await getConfigValue('commerce-endpoint'));

  // Set Fetch Headers (Service)
  product.setFetchGraphQlHeaders({
    'Content-Type': 'application/json',
    'Magento-Environment-Id': await getConfigValue('commerce-environment-id'),
    'Magento-Website-Code': await getConfigValue('commerce-website-code'),
    'Magento-Store-View-Code': await getConfigValue('commerce-store-view-code'),
    'Magento-Store-Code': await getConfigValue('commerce-store-code'),
    'Magento-Customer-Group': await getConfigValue('commerce-customer-group'),
    'x-api-key': await getConfigValue('commerce-x-api-key'),
  });

  // Render Containers

  return productRenderer.render(ProductDetails, {
    sku: getSkuFromUrl(),
    carousel: {
      controls: 'thumbnailsRow', // 'thumbnailsColumn', 'thumbnailsRow', 'dots'
      mobile: true,
    },
    hideAttributes: true,
    hideDescription: true,
    slots: {
      Actions: (ctx) => {
        ctx.appendButton((next) => ({
          text: "ADD TO CART",
          icon: "Cart",
          variant: "primary",
          disabled: !next.data?.inStock || !next.valid,
          onClick: async () => {
            await addProductsToCart([
              {
                ...next.values,
              },
            ]);
            console.log('finished adding to cart')
          },
        }));
      },
    },
  })(block);
}
