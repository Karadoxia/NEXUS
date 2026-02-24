import { useCartStore } from '@/src/stores/cartStore';

const sampleProduct = { id: 'p1', name: 'Widget', price: 10 };

describe('cartStore', () => {
  beforeEach(() => {
    const store = useCartStore.getState();
    store.clearCart();
  });

  it('adds items and counts correctly', () => {
    const store = useCartStore.getState();
    store.addItem(sampleProduct);
    expect(store.count()).toBe(1);
    expect(store.total()).toBe(10);
  });

  it('updates quantity and price', () => {
    const store = useCartStore.getState();
    store.addItem(sampleProduct);
    store.updateQuantity('p1', 3);
    expect(store.count()).toBe(3);
    expect(store.total()).toBe(30);
  });

  it('removes items', () => {
    const store = useCartStore.getState();
    store.addItem(sampleProduct);
    store.removeItem('p1');
    expect(store.count()).toBe(0);
  });
});
