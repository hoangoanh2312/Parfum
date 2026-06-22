# ERD - HOC PARFUM (MongoDB)

```
User (1) ───< (n) Order ───< (n) OrderItem >─── (1) Variant >─── (1) Product
  │                │                                              │
  │                └── (1) Payment                                ├──< Variant (n)
  │                                                               ├── (1) Brand
  ├──< (n) Review >── (1) Product                                 └── (1) Category
  ├── (1) Cart ───< (n) CartItem >─── (1) Variant
  └── (1) Wishlist ───< (n) Product
```

## Collections
- **User**: name, email(unique), password(hash), role[customer|admin], addresses[]
- **Category**: name, slug(unique)
- **Brand**: name, slug(unique), logo
- **Product**: name, slug, description, brand->Brand, category->Category, images[], notes{top,middle,base}, isActive
- **Variant**: product->Product, sku(unique), volume, price, stock
- **Cart**: user->User, items[{variant->Variant, quantity}]
- **Order**: user->User, items[{variant,name,price,quantity}], total, status[pending|paid|shipping|done|cancelled], address
- **Payment**: order->Order, method[cod|bank_qr], status[unpaid|paid], amount
- **Review**: product->Product, user->User, rating(1-5), comment, images[], approved
- **Wishlist**: user->User, products[->Product]
