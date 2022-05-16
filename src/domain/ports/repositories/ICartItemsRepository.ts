export interface ICartItemsRepository {
  removeByCartId(cartId: string): Promise<void>;
}
