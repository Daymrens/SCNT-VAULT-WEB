# SCNT Vault Admin Panel

## Quick Start

1. **Access**: Navigate to `/admin/` on your deployed site
2. **Login**: Use Firebase Authentication credentials
3. **Manage**: Full CRUD operations for products, orders, and inventory

## Features Overview

### 📊 Dashboard
- Real-time metrics and KPIs
- Recent orders overview
- Low stock alerts

### 🧴 Products
- Add/Edit/Delete products
- Search and filter functionality
- Stock level management
- Image and description support

### 📦 Inventory
- Stock adjustments (in/out)
- Transaction logging
- Low stock monitoring
- Reorder alerts

### 🛒 Orders
- View all orders
- Update order status
- Customer information
- Order details and history

### 👥 Customers
- Customer database
- Order history per customer
- Total spent tracking
- Contact information

### 📈 Analytics
- Revenue tracking
- Top selling products
- Category performance
- Customer metrics

### ⚙️ Settings
- Store configuration
- Account management
- Database status

## Tech Stack

- **Frontend**: Vanilla JavaScript
- **Backend**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting

## File Structure

```
/admin/
├── index.html              # Main admin page
├── assets/
│   ├── admin-app.js       # Application logic
│   └── admin-styles.css   # Styling
└── api/
    └── firebase-admin.js  # Firebase API functions
```

## Security

- Authentication required
- Firestore security rules
- Admin-only access
- Session management

## Deployment

Already deployed at: `https://scnt-vault.web.app/admin/`

To update:
```bash
firebase deploy --only hosting
```
